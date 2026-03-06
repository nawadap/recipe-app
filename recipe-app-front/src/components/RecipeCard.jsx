import { Link } from 'react-router-dom'

function RecipeCard({ recipe }) {
  return (
    <div className="card">
      <h2>{recipe.title}</h2>
      <p>{recipe.description.length > 80 ? recipe.description.slice(0, 80) + '...' : recipe.description}</p>
      <p><strong>Temps :</strong> {recipe.prepTime} min</p>
      <p><strong>Catégorie :</strong> {recipe.category}</p>
      <Link to={`/recipe/${recipe.id}`} className="btn">
        Voir détail
      </Link>
    </div>
  )
}

export default RecipeCard