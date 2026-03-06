import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deleteRecipe, getRecipe } from '../services/api'

function RecipeDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await getRecipe(id)
        setRecipe(response.data)
      } catch (err) {
        setError('Erreur lors du chargement de la recette')
      } finally {
        setLoading(false)
      }
    }

    fetchRecipe()
  }, [id])

  const handleDelete = async () => {
    const confirmed = window.confirm('Voulez-vous vraiment supprimer cette recette ?')

    if (!confirmed) {
      return
    }

    try {
      await deleteRecipe(id)
      navigate('/')
    } catch (err) {
      setError('Erreur lors de la suppression')
    }
  }

  if (loading) {
    return (
      <div className="container">
        <p>Chargement...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container">
        <p className="error">{error}</p>
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="container">
        <p>Recette introuvable.</p>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="detail-card">
        <h1>{recipe.title}</h1>
        <p>{recipe.description}</p>
        <p><strong>Temps :</strong> {recipe.prepTime} min</p>
        <p><strong>Catégorie :</strong> {recipe.category}</p>

        <h2>Ingrédients</h2>
        <ul>
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>

        <h2>Étapes</h2>
        <ol>
          {recipe.steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>

        <div className="actions">
          <Link to={`/edit/${recipe.id}`} className="btn">
            Modifier
          </Link>
          <button onClick={handleDelete} className="btn btn-danger">
            Supprimer
          </button>
          <Link to="/" className="btn btn-secondary">
            Retour
          </Link>
        </div>
      </div>
    </div>
  )
}

export default RecipeDetailPage