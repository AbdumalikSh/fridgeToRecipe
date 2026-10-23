import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  Check,
  ChefHat,
  Clock3,
  Leaf,
  LoaderCircle,
  Plus,
  RotateCcw,
  Sparkles,
  Users,
  X,
} from "lucide-react";

const initialIngredients = [
  "Chicken thighs",
  "Cherry tomatoes",
  "Spinach",
  "Orzo",
  "Lemon",
];

const featuredRecipes = [
  {
    title: "Lemon Herb Chicken", cuisine: "Mediterranean", time: 30,
    ingredients: [{ amount: "2", name: "chicken thighs" }, { amount: "1 cup", name: "couscous" }, { amount: "1", name: "lemon" }, { amount: "2 cloves", name: "garlic" }, { amount: "2 tbsp", name: "chopped parsley" }, { amount: "1 tbsp", name: "olive oil" }, { amount: "1 cup", name: "chicken broth or water" }, { amount: "to taste", name: "salt and black pepper" }],
    instructions: ["Season the chicken with salt and pepper. Heat the olive oil in a skillet over medium-high heat and sear the chicken for 5–6 minutes per side until golden and cooked through.", "While it cooks, bring the broth or water to a boil. Stir in the couscous, cover, remove from the heat, and let stand for 5 minutes.", "Zest and juice the lemon. Fluff the couscous with a fork and stir in half the lemon juice and parsley.", "Rest the chicken for 3 minutes, then serve over couscous with the remaining lemon and parsley."],
    note: "Bright, herby, and weeknight friendly.", color: "sage"
  },
  {
    title: "Creamy Tomato Orzo", cuisine: "Italian", time: 25,
    ingredients: [{ amount: "1 cup", name: "orzo" }, { amount: "1 cup", name: "cherry tomatoes" }, { amount: "2 handfuls", name: "spinach" }, { amount: "½ cup", name: "cream" }, { amount: "¼ cup", name: "grated parmesan" }, { amount: "2 cups", name: "vegetable broth" }, { amount: "1 tbsp", name: "olive oil" }, { amount: "to taste", name: "salt and black pepper" }],
    instructions: ["Warm olive oil in a deep skillet over medium heat. Add the orzo and toast for 1 minute, stirring.", "Pour in the broth and add the cherry tomatoes. Simmer uncovered for 10–12 minutes, stirring often, until the orzo is tender.", "Stir in the cream and spinach. Cook for 2 minutes until the spinach wilts and the sauce turns creamy.", "Fold in parmesan, season with salt and pepper, and serve while warm."],
    note: "One pan, silky sauce, little cleanup.", color: "clay"
  },
  {
    title: "Crispy Chickpea Bowl", cuisine: "Middle Eastern", time: 35,
    ingredients: [{ amount: "1 can, drained", name: "chickpeas" }, { amount: "1 cup", name: "rice" }, { amount: "½", name: "cucumber" }, { amount: "½ cup", name: "plain yogurt" }, { amount: "½", name: "lemon" }, { amount: "1 tsp", name: "ground cumin" }, { amount: "1 tbsp", name: "olive oil" }, { amount: "to taste", name: "salt" }],
    instructions: ["Cook the rice according to its package directions. Heat the oven to 425°F (220°C).", "Pat the chickpeas dry, toss with olive oil, cumin, and salt, then roast on a tray for 20–25 minutes, shaking once, until crisp.", "Dice the cucumber. Stir the yogurt with lemon juice, a pinch of salt, and a splash of water to make a pourable sauce.", "Divide rice between bowls. Add the crispy chickpeas and cucumber, then drizzle with lemon yogurt."],
    note: "Crunchy, cool, and full of color.", color: "gold"
  },
  {
    title: "Miso Mushroom Noodles", cuisine: "Japanese", time: 20,
    ingredients: [{ amount: "200 g", name: "noodles" }, { amount: "200 g", name: "mushrooms" }, { amount: "1 tbsp", name: "miso paste" }, { amount: "2", name: "scallions" }, { amount: "1 tsp", name: "sesame oil" }, { amount: "1 tbsp", name: "soy sauce" }, { amount: "1 tsp", name: "neutral oil" }, { amount: "1 cup", name: "hot noodle water" }],
    instructions: ["Cook the noodles according to the package. Reserve a cup of cooking water, then drain.", "Slice the mushrooms and scallions. Heat neutral oil in a pan over medium-high heat and cook the mushrooms for 5–7 minutes until browned.", "Whisk miso and soy sauce with the hot noodle water until smooth. Add the sauce and sesame oil to the pan.", "Toss the noodles through the sauce for 1–2 minutes. Top with scallions and serve."],
    note: "Savory comfort in a hurry.", color: "plum"
  },
  {
    title: "Black Bean Tacos", cuisine: "Mexican", time: 20,
    ingredients: [{ amount: "1 can, drained", name: "black beans" }, { amount: "6 small", name: "corn tortillas" }, { amount: "1", name: "avocado" }, { amount: "1", name: "lime" }, { amount: "1 cup", name: "shredded red cabbage" }, { amount: "½ tsp", name: "ground cumin" }, { amount: "2 tbsp", name: "water" }, { amount: "to taste", name: "salt" }],
    instructions: ["Warm the beans in a small pan with cumin, water, and a pinch of salt. Mash a few beans to thicken them.", "Warm the tortillas in a dry skillet for about 30 seconds per side, then wrap them in a clean towel.", "Slice the avocado and squeeze lime juice over it. Toss the cabbage with another squeeze of lime and a pinch of salt.", "Fill each tortilla with beans, cabbage, and avocado. Finish with more lime and serve."],
    note: "A fresh, easy taco night.", color: "olive"
  },
  {
    title: "Coconut Lentil Curry", cuisine: "Indian", time: 35,
    ingredients: [{ amount: "1 cup", name: "red lentils" }, { amount: "1 can", name: "coconut milk" }, { amount: "2 handfuls", name: "spinach" }, { amount: "1 tbsp", name: "curry paste" }, { amount: "1 cup", name: "rice" }, { amount: "1", name: "onion" }, { amount: "1½ cups", name: "water" }, { amount: "to taste", name: "salt" }],
    instructions: ["Cook the rice according to its package directions. Rinse the lentils until the water runs mostly clear.", "Finely chop the onion. Cook it in a saucepan with a splash of oil over medium heat for 4–5 minutes until soft. Stir in the curry paste for 30 seconds.", "Add lentils, coconut milk, and water. Bring to a gentle boil, then simmer uncovered for 18–22 minutes, stirring occasionally, until tender.", "Fold in spinach until wilted. Season with salt and serve over rice."],
    note: "Warm spices and a cozy bowl.", color: "peach"
  },
];

const ingredientSuggestions = [
  "Avocado", "Bell pepper", "Black beans", "Broccoli", "Carrot", "Cheddar", "Chicken breast", "Chicken thighs", "Chickpeas", "Coconut milk", "Cucumber", "Eggs", "Feta", "Garlic", "Ginger", "Lemon", "Lime", "Mushrooms", "Onion", "Orzo", "Pasta", "Potatoes", "Rice", "Salmon", "Spinach", "Tomatoes", "Tortillas", "Zucchini",
];

const cuisineOptions = [
  "Any cuisine", "American", "Chinese", "Ethiopian", "French", "Greek", "Indian", "Italian", "Japanese", "Korean", "Mediterranean", "Mexican", "Middle Eastern", "Thai", "Turkish",
];

const dietaryOptions = ["No preference", "Dairy-free", "Gluten-free", "Halal", "High-protein", "Kosher", "Low-carb", "Nut-free", "Pescatarian", "Vegan", "Vegetarian"];

function RecipeCard({ recipe, index }) {
  const [expanded, setExpanded] = useState(index === 0);
  return (
    <article className="recipe-card">
      <div className="recipe-top">
        <span className="recipe-index">0{index + 1} / RECIPE</span>
        <span className="recipe-time">
          <Clock3 size={15} /> {recipe.cookTimeMinutes} min
        </span>
      </div>
      <h3>{recipe.title}</h3>
      <p className="recipe-sub">
        A good use for what’s already in your kitchen.
      </p>
      <div className="card-rule" />
      <button
        className="expand-button"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <span>Ingredients & method</span>
        <ArrowDown className={expanded ? "arrow-up" : ""} size={17} />
      </button>
      {expanded && (
        <div className="recipe-details">
          <div className="ingredients-list">
            {(recipe.ingredients || []).map((item, i) => (
              <div className="ingredient-row" key={`${item.name}-${i}`}>
                <span
                  className={
                    item.inFridge
                      ? "ingredient-dot have"
                      : "ingredient-dot missing"
                  }
                >
                  {item.inFridge ? <Check size={11} /> : <Plus size={11} />}
                </span>
                <span className={item.inFridge ? "" : "missing-text"}>
                  {item.amount ? `${item.amount} ` : ""}
                  {item.name}
                </span>
                {!item.inFridge && <small>NEED</small>}
              </div>
            ))}
          </div>
          <h4>Let’s make it</h4>
          <ol className="instructions">
            {(recipe.instructions || []).map((step, i) => (
              <li key={i}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <p>{step}</p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </article>
  );
}

export default function App() {
  const [ingredients, setIngredients] = useState(initialIngredients);
  const [draft, setDraft] = useState("");
  const [dietary, setDietary] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [maxCookTime, setMaxCookTime] = useState("");
  const [servings, setServings] = useState("2");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ingredientFocused, setIngredientFocused] = useState(false);
  const [customCuisine, setCustomCuisine] = useState(null);
  const recipeDetailRef = useRef(null);
  const [selectedFeaturedRecipe, setSelectedFeaturedRecipe] = useState(null);
  const [customDietary, setCustomDietary] = useState(null);

  useEffect(() => {
    if (selectedFeaturedRecipe) recipeDetailRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selectedFeaturedRecipe]);

  const suggestions = draft.trim()
    ? ingredientSuggestions.filter((item) =>
        item.toLowerCase().includes(draft.trim().toLowerCase()) &&
        !ingredients.some((ingredient) => ingredient.toLowerCase() === item.toLowerCase()),
      ).slice(0, 5)
    : [];

  const addIngredient = (event, suggestedValue) => {
    event?.preventDefault();
    const value = (suggestedValue || draft).trim();
    if (
      value &&
      !ingredients.some((item) => item.toLowerCase() === value.toLowerCase())
    )
      setIngredients([...ingredients, value]);
    setDraft("");
  };

  const useFeaturedRecipe = (recipe) => {
    setIngredients(recipe.ingredients.map((item) => item.name));
    setCuisine(recipe.cuisine);
    setCustomCuisine(null);
    setSelectedFeaturedRecipe(null);
    setRecipes([]);
    document.getElementById("recipe-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  const generate = async () => {
    if (!ingredients.length) {
      setError("Add at least one ingredient to get started.");
      return;
    }
    setLoading(true);
    setError("");
    setRecipes([]);
    try {
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients,
          dietary,
          cuisine,
          maxCookTime,
          servings,
        }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(
          data.error || "Could not generate recipes. Please try again.",
        );
      setRecipes(data.recipes);
    } catch (err) {
      setError(
        err.message ||
          "Could not reach the recipe service. Check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <header className="site-header">
        <a href="#top" className="brand">
          <span className="brand-mark">
            <ChefHat size={19} />
          </span>{" "}
          good<span className="brand-light">fridge</span>
        </a>
        <span className="header-note">
          <span className="status-dot" /> YOUR KITCHEN, REIMAGINED
        </span>
      </header>
      <main id="top">
        <section className="hero">
          <div className="eyebrow">
            <Sparkles size={13} /> A LITTLE INSPIRATION FOR DINNER
          </div>
          <h1>
            Good things start
            <br />
            in your <em>fridge.</em>
          </h1>
          <p className="hero-copy">
            Tell us what you have. We’ll find three lovely ways to make it a
            meal.
          </p>
        </section>
        <section className="featured-section" aria-label="Ready-to-cook recipe ideas">
          <div className="featured-heading">
            <div>
              <div className="eyebrow"><Sparkles size={13} /> A FEW GOOD STARTING POINTS</div>
              <h2>Ready when <em>you are.</em></h2>
            </div>
          </div>
          <div className="featured-carousel">
            <div className="featured-track">
              {[0, 1].map((copy) => (
                <div className="featured-set" key={copy} aria-hidden={copy === 1}>
                  {featuredRecipes.map((recipe) => (
                    <article className={`featured-card ${recipe.color}`} key={recipe.title}>
                      <div className="featured-card-top"><span>{recipe.cuisine}</span><span><Clock3 size={13} /> {recipe.time} min</span></div>
                      <div className="featured-illustration"><span><ChefHat size={28} /></span><i>✳</i></div>
                      <h3>{recipe.title}</h3>
                      <p>{recipe.note}</p>
                      <button tabIndex={copy === 1 ? -1 : 0} onClick={() => setSelectedFeaturedRecipe(recipe)}>View recipe <ArrowRight size={14} /></button>
                    </article>
                  ))}
                </div>
              ))}
            </div>
          </div>
          {selectedFeaturedRecipe && <section className="featured-detail" ref={recipeDetailRef} aria-live="polite">
            <div className="featured-detail-head">
              <div><div className="eyebrow">{selectedFeaturedRecipe.cuisine} · READY IN {selectedFeaturedRecipe.time} MIN</div><h3>{selectedFeaturedRecipe.title}</h3></div>
              <button className="detail-close" aria-label="Close recipe details" onClick={() => setSelectedFeaturedRecipe(null)}><X size={17} /></button>
            </div>
            <p className="featured-detail-note">{selectedFeaturedRecipe.note} <span>Serves 2</span></p>
            <div className="featured-detail-content">
              <div><h4>Ingredients</h4><ul>{selectedFeaturedRecipe.ingredients.map((item) => <li key={item.name}><span>{item.amount}</span>{item.name}</li>)}</ul></div>
              <div><h4>How to cook it</h4><ol className="instructions">{selectedFeaturedRecipe.instructions.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span><p>{step}</p></li>)}</ol></div>
            </div>
            <button className="use-featured-button" onClick={() => useFeaturedRecipe(selectedFeaturedRecipe)}>Use these ingredients in my form <ArrowRight size={15} /></button>
          </section>}
        </section>
        <section className="workspace" id="recipe-form">
          <div className="form-column">
            <div className="section-heading">
              <span className="step-no">01</span>
              <div>
                <h2>What’s on hand?</h2>
                <p>Use what you’ve got. A little extra is always welcome.</p>
              </div>
            </div>
            <div className="ingredient-entry-wrap">
            <form className="ingredient-input" onSubmit={addIngredient}>
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onFocus={() => setIngredientFocused(true)}
                onBlur={() => setIngredientFocused(false)}
                placeholder="Add an ingredient…"
                aria-label="Add an ingredient"
                aria-autocomplete="list"
                aria-expanded={ingredientFocused && suggestions.length > 0}
              />
              <button aria-label="Add ingredient">
                <Plus size={18} />
              </button>
            </form>
            {ingredientFocused && suggestions.length > 0 && <div className="ingredient-suggestions" role="listbox" aria-label="Ingredient suggestions">
              {suggestions.map((suggestion) => <button type="button" role="option" key={suggestion} onMouseDown={(event) => event.preventDefault()} onClick={() => addIngredient(null, suggestion)}><Plus size={13} /> {suggestion}<span>Add</span></button>)}
            </div>}
            </div>
            <div className="ingredient-chips">
              {ingredients.map((item) => (
                <span className="chip" key={item}>
                  {item}
                  <button
                    onClick={() =>
                      setIngredients(
                        ingredients.filter((value) => value !== item),
                      )
                    }
                    aria-label={`Remove ${item}`}
                  >
                    <X size={13} />
                  </button>
                </span>
              ))}
              {!ingredients.length && (
                <p className="empty-note">
                  Your list is empty. Add a few ingredients above.
                </p>
              )}
            </div>
            <div className="section-heading constraints-title">
              <span className="step-no">02</span>
              <div>
                <h2>Any preferences?</h2>
                <p>Only fill in what matters today.</p>
              </div>
            </div>
            <div className="constraints-grid">
              <label className="field full">
                <span>
                  <Leaf size={14} /> Dietary
                </span>
                <select value={customDietary !== null ? "Other dietary restriction" : dietary || "No preference"} onChange={(e) => {
                  const value = e.target.value;
                  if (value === "Other dietary restriction") {
                    setCustomDietary("");
                    setDietary("");
                  } else {
                    setCustomDietary(null);
                    setDietary(value === "No preference" ? "" : value);
                  }
                }}>
                  {dietaryOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                  <option value="Other dietary restriction">Other / multiple restrictions…</option>
                </select>
                {customDietary !== null && <input className="custom-cuisine" value={customDietary} onChange={(e) => { setCustomDietary(e.target.value); setDietary(e.target.value); }} placeholder="Type your restrictions" />}
              </label>
              <label className="field">
                <span>Cuisine</span>
                <select value={customCuisine !== null ? "Other cuisine" : cuisineOptions.includes(cuisine) ? cuisine : "Any cuisine"} onChange={(e) => {
                  const value = e.target.value;
                  if (value === "Other cuisine") {
                    setCustomCuisine("");
                    setCuisine("");
                  } else {
                    setCustomCuisine(null);
                    setCuisine(value === "Any cuisine" ? "" : value);
                  }
                }}>
                  {cuisineOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                  <option value="Other cuisine">Other cuisine…</option>
                </select>
                {customCuisine !== null && <input className="custom-cuisine" value={customCuisine} onChange={(e) => { setCustomCuisine(e.target.value); setCuisine(e.target.value); }} placeholder="Type a cuisine" />}
              </label>
              <label className="field">
                <span>
                  <Clock3 size={14} /> Max time
                </span>
                <div className="input-suffix">
                  <input
                    type="number"
                    min="1"
                    max="1440"
                    value={maxCookTime}
                    onChange={(e) => setMaxCookTime(e.target.value)}
                    placeholder="Any"
                  />
                  <small>MIN</small>
                </div>
              </label>
              <label className="field">
                <span>
                  <Users size={14} /> Servings
                </span>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                />
              </label>
            </div>
            <button
              className="generate-button"
              onClick={generate}
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoaderCircle className="spin" size={17} /> Finding your
                  recipes…
                </>
              ) : (
                <>
                  Find my recipes <ArrowRight size={17} />
                </>
              )}
            </button>
            <p className="privacy-note">
              Thoughtful ideas, made just for your kitchen.
            </p>
            {error && (
              <div className="error-message" role="alert">
                {error}{" "}
                <button onClick={() => setError("")} aria-label="Dismiss error">
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
          <aside className="aside-note">
            <div className="note-mark">“</div>
            <p>
              The best meals aren’t always planned. Sometimes they’re just
              waiting to be found.
            </p>
            <div className="note-line" />
            <span>A NOTE FROM YOUR KITCHEN</span>
            <div className="leaf-art">
              <span>✳</span>
              <span>✳</span>
              <span>✳</span>
            </div>
          </aside>
        </section>
        {recipes.length > 0 && (
          <section className="results" aria-live="polite">
            <div className="results-heading">
              <div>
                <div className="eyebrow">
                  <Sparkles size={13} /> YOUR KITCHEN, THREE WAYS
                </div>
                <h2>
                  Something <em>good</em> is cooking.
                </h2>
              </div>
              <button className="reset-button" onClick={generate}>
                <RotateCcw size={14} /> Try again
              </button>
            </div>
            <div className="results-legend">
              <span>
                <i className="legend-have">
                  <Check size={10} />
                </i>{" "}
                In your fridge
              </span>
              <span>
                <i className="legend-missing">
                  <Plus size={10} />
                </i>{" "}
                Pick up
              </span>
            </div>
            <div className="recipe-grid">
              {recipes.map((recipe, i) => (
                <RecipeCard
                  key={`${recipe.title}-${i}`}
                  recipe={recipe}
                  index={i}
                />
              ))}
            </div>
          </section>
        )}
        {!recipes.length && !loading && (
          <div className="below-note">
            A little planning. A lot less waste. <span>✳</span>
          </div>
        )}
      </main>
      <footer>
        <span>
          Abdumalik Shukrilloev<i>© 2026</i>
        </span>
        <span>COOK WITH WHAT YOU HAVE</span>
      </footer>
    </div>
  );
}
