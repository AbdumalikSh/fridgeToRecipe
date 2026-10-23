# goodfridge — Fridge to Recipe

A React + Express app that turns ingredients you have into three recipe ideas. Add dietary preferences, cuisine, a maximum cook time, and servings as needed. Each recipe shows its full ingredient list, marks pantry items you already have, and includes step-by-step instructions.

## Requirements

- Node.js 20 or newer (uses the built-in `fetch` API)
- An OpenAI API key

## Setup

1. Install dependencies from the repository root:

   ```sh
   npm install
   ```

2. Create a local environment file and add your key:

   ```sh
   cp .env.example .env
   ```

   Set `OPENAI_API_KEY` in `.env`. The key is read by Express and is never sent to the browser. `.env` is ignored by Git.

3. Start the API and React development server:

   ```sh
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173). Vite forwards `/api` requests to Express on port 3001.

To build the frontend for production, run `npm run build`. Start the API with `npm start`; serve the generated `client/dist` directory from your preferred static host or reverse proxy.

## Environment variables

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `OPENAI_API_KEY` | Yes | — | OpenAI API key, used only by the Express server |
| `OPENAI_MODEL` | No | `gpt-4.1-mini` | Model used for recipe suggestions |
| `PORT` | No | `3001` | Express server port |

## Example run

The web app sends a JSON request to `POST /api/recipes`. You can try the same request directly:

```sh
curl -s http://localhost:3001/api/recipes \
  -H 'Content-Type: application/json' \
  -d '{
    "ingredients": ["chicken thighs", "cherry tomatoes", "spinach", "orzo", "lemon"],
    "dietary": "",
    "cuisine": "Mediterranean",
    "maxCookTime": 35,
    "servings": 2
  }'
```

Example output (recipe wording and suggestions vary with each API response):

```json
{
  "recipes": [
    {
      "title": "One-Pan Lemon Chicken Orzo",
      "cookTimeMinutes": 30,
      "ingredients": [
        { "name": "chicken thighs", "amount": "2", "inFridge": true },
        { "name": "orzo", "amount": "1 cup", "inFridge": true },
        { "name": "cherry tomatoes", "amount": "1 cup", "inFridge": true },
        { "name": "spinach", "amount": "2 handfuls", "inFridge": true },
        { "name": "lemon", "amount": "1", "inFridge": true },
        { "name": "chicken broth", "amount": "2 cups", "inFridge": false },
        { "name": "olive oil", "amount": "1 tbsp", "inFridge": false },
        { "name": "garlic", "amount": "2 cloves", "inFridge": false },
        { "name": "salt and black pepper", "amount": "to taste", "inFridge": false }
      ],
      "instructions": [
        "Season the chicken with salt and pepper. Heat olive oil in a deep skillet over medium-high heat and brown the chicken for 4 minutes per side.",
        "Add minced garlic and orzo; stir for 1 minute. Pour in the broth, add the tomatoes, and bring to a simmer.",
        "Cover and cook for 10–12 minutes, stirring once, until the orzo is tender and the chicken is cooked through.",
        "Fold in the spinach and lemon zest and juice. Rest for 2 minutes, then serve."
      ]
    },
    {
      "title": "Mediterranean Chicken & Tomato Skillet",
      "cookTimeMinutes": 32,
      "ingredients": [
        { "name": "chicken thighs", "amount": "2", "inFridge": true },
        { "name": "cherry tomatoes", "amount": "1½ cups", "inFridge": true },
        { "name": "spinach", "amount": "2 handfuls", "inFridge": true },
        { "name": "lemon", "amount": "½", "inFridge": true },
        { "name": "olive oil", "amount": "1 tbsp", "inFridge": false },
        { "name": "garlic", "amount": "2 cloves", "inFridge": false },
        { "name": "dried oregano", "amount": "1 tsp", "inFridge": false },
        { "name": "salt and black pepper", "amount": "to taste", "inFridge": false }
      ],
      "instructions": [
        "Season the chicken with salt, pepper, and oregano. Warm olive oil in a skillet over medium heat.",
        "Brown the chicken for 5 minutes per side, then transfer it to a plate. Add minced garlic and tomatoes to the skillet and cook for 4 minutes.",
        "Return the chicken to the pan, cover, and cook for 12–15 minutes until cooked through.",
        "Stir in the spinach until wilted. Finish with lemon juice and serve with the pan juices."
      ]
    },
    {
      "title": "Lemony Spinach Orzo with Chicken",
      "cookTimeMinutes": 28,
      "ingredients": [
        { "name": "chicken thighs", "amount": "2", "inFridge": true },
        { "name": "orzo", "amount": "1 cup", "inFridge": true },
        { "name": "spinach", "amount": "2 handfuls", "inFridge": true },
        { "name": "lemon", "amount": "1", "inFridge": true },
        { "name": "chicken broth", "amount": "2 cups", "inFridge": false },
        { "name": "olive oil", "amount": "1 tbsp", "inFridge": false },
        { "name": "parmesan", "amount": "¼ cup", "inFridge": false },
        { "name": "salt and black pepper", "amount": "to taste", "inFridge": false }
      ],
      "instructions": [
        "Season and slice the chicken into bite-size pieces. Heat olive oil in a skillet over medium-high heat and cook the chicken until golden and cooked through, about 7 minutes.",
        "Add the orzo and broth. Bring to a simmer and cook for 9–10 minutes, stirring often, until the orzo is tender.",
        "Stir in spinach, lemon zest, and lemon juice until the spinach wilts.",
        "Take the pan off the heat, fold in parmesan, season to taste, and serve."
      ]
    }
  ]
}
```

## API

- `GET /api/health` — returns `{ "status": "ok" }`.
- `POST /api/recipes` — accepts `ingredients` (required array) plus optional `dietary`, `cuisine`, `maxCookTime` (minutes), and `servings`. Returns `{ "recipes": [...] }`.

The server validates user input and returns actionable JSON errors. It retries once after network errors, timeouts, rate limits, and transient provider errors (HTTP 408/429/5xx).
