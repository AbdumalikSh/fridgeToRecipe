import dotenv from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';

dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env') });

const app = express();
const port = Number(process.env.PORT) || 3001;
const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
app.use(cors());
app.use(express.json({ limit: '32kb' }));

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

function validate(body) {
  if (!Array.isArray(body?.ingredients)) return 'Ingredients must be provided as a list.';
  const ingredients = body.ingredients.map((item) => String(item).trim()).filter(Boolean);
  if (!ingredients.length) return 'Add at least one ingredient.';
  if (ingredients.length > 50) return 'Please enter 50 ingredients or fewer.';
  if (ingredients.some((item) => item.length > 100)) return 'Each ingredient must be 100 characters or fewer.';
  const { maxCookTime, servings } = body;
  if (maxCookTime != null && maxCookTime !== '' && (!Number.isFinite(Number(maxCookTime)) || Number(maxCookTime) < 1 || Number(maxCookTime) > 1440)) return 'Max cook time must be between 1 and 1440 minutes.';
  if (servings != null && servings !== '' && (!Number.isInteger(Number(servings)) || Number(servings) < 1 || Number(servings) > 20)) return 'Servings must be a whole number from 1 to 20.';
  return null;
}

function promptFor({ ingredients, dietary, cuisine, maxCookTime, servings }) {
  return `Suggest exactly three practical recipes based on the user's ingredients and constraints. Return JSON only, with this shape: {"recipes":[{"title":"...","cookTimeMinutes":30,"ingredients":[{"name":"...","amount":"...","inFridge":true}],"instructions":["..."]}]}. Include a complete recipe ingredient list; set inFridge true only when the ingredient is among the user's supplied ingredients. Keep instructions clear and sequential. Respect constraints. User ingredients: ${ingredients.join(', ')}. Dietary restrictions: ${dietary || 'none'}. Cuisine: ${cuisine || 'no preference'}. Maximum cook time: ${maxCookTime ? `${maxCookTime} minutes` : 'no limit'}. Servings: ${servings || 'unspecified'}.`;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function requestRecipes(payload) {
  let lastError;
  let retryDelayMs = 500;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(45000),
        body: JSON.stringify({
          model,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: 'You are a helpful recipe planner. Return valid JSON with exactly three recipes.' },
            { role: 'user', content: promptFor(payload) }
          ],
          temperature: 0.7
        })
      });
      if (response.ok) {
        const data = await response.json();
        return JSON.parse(data.choices?.[0]?.message?.content || '{}');
      }
      const detail = await response.text();
      const error = new Error(`Recipe provider returned ${response.status}.`);
      error.status = response.status;
      error.detail = detail;
      if ([408, 429, 500, 502, 503, 504].includes(response.status)) {
        const retryAfterMs = Number(response.headers.get('retry-after-ms'));
        const retryAfterSeconds = Number(response.headers.get('retry-after'));
        if (Number.isFinite(retryAfterMs) && retryAfterMs > 0) retryDelayMs = Math.min(retryAfterMs, 30_000);
        else if (Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0) retryDelayMs = Math.min(retryAfterSeconds * 1000, 30_000);
        else retryDelayMs = response.status === 429 ? 2_000 : 500;
      }
      try {
        const providerError = JSON.parse(detail).error;
        error.providerCode = providerError?.code || providerError?.type;
        error.providerMessage = providerError?.message;
      } catch {
        // Keep provider response details out of the client response.
      }
      if (![408, 429, 500, 502, 503, 504].includes(response.status)) throw error;
      lastError = error;
    } catch (error) {
      if (error.status && ![408, 429, 500, 502, 503, 504].includes(error.status)) throw error;
      lastError = error;
    }
    if (attempt === 0) await sleep(retryDelayMs);
  }
  throw lastError;
}

app.post('/api/recipes', async (req, res) => {
  const validationError = validate(req.body);
  if (validationError) return res.status(400).json({ error: validationError });
  if (!process.env.OPENAI_API_KEY) return res.status(503).json({ error: 'Recipe suggestions are not configured. Set OPENAI_API_KEY on the server.' });
  const payload = {
    ingredients: req.body.ingredients.map((item) => String(item).trim()).filter(Boolean),
    dietary: String(req.body.dietary || '').trim(),
    cuisine: String(req.body.cuisine || '').trim(),
    maxCookTime: req.body.maxCookTime || '',
    servings: req.body.servings || ''
  };
  try {
    const result = await requestRecipes(payload);
    if (!Array.isArray(result.recipes) || result.recipes.length !== 3) throw new Error('Recipe provider returned an unexpected response.');
    res.json({ recipes: result.recipes });
  } catch (error) {
    console.error('Recipe request failed:', JSON.stringify({ status: error.status || null, code: error.providerCode || null, message: error.providerMessage || error.message }));
    if (error.status === 401 || error.status === 403) return res.status(502).json({ error: 'The recipe provider rejected the API key. Check OPENAI_API_KEY.' });
    if (error.status === 429 && ['insufficient_quota', 'billing_hard_limit_reached'].includes(error.providerCode)) {
      return res.status(503).json({ error: 'The OpenAI API project has run out of available quota. Check API billing and project usage limits, then try again.' });
    }
    if (error.status === 429) return res.status(503).json({ error: 'OpenAI is rate limiting this project or model. Check the API project limits for requests and tokens, then retry after the limit resets.' });
    res.status(502).json({ error: 'Could not generate recipes right now. Please try again.' });
  }
});

app.use((error, _req, res, _next) => {
  if (error instanceof SyntaxError && error.status === 400) return res.status(400).json({ error: 'Request body must be valid JSON.' });
  console.error(error);
  res.status(500).json({ error: 'Unexpected server error.' });
});

app.listen(port, () => console.log(`Fridge to Recipe API listening on http://localhost:${port}`));
