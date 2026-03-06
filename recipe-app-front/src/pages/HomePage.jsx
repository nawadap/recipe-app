import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getRecipes } from '../services/api'
import RecipeCard from '../components/RecipeCard'

function HomePage() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await getRecipes()
        setRecipes(response.data)
      } catch (err) {
        setError('Erreur lors du chargement des recettes')
      } finally {
        setLoading(false)
      }
    }

    fetchRecipes()
  }, [])

  return (
    <div className="container">
      <div className="top-bar">
        <h1>Mes recettes</h1>
        <Link to="/add" className="btn">
          Ajouter une recette
        </Link>
      </div>

      {loading && <p>Chargement...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && recipes.length === 0 && (
        <p>Aucune recette disponible.</p>
      )}

      <div className="grid">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  )
}

export default HomePage