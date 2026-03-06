import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createRecipe, getRecipe, updateRecipe } from '../services/api'

function RecipeFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = Boolean(id)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: '',
    steps: '',
    prepTime: '',
    category: 'plat'
  })

  const [loading, setLoading] = useState(isEditMode)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isEditMode) {
      return
    }

    const fetchRecipe = async () => {
      try {
        const response = await getRecipe(id)
        const recipe = response.data

        setFormData({
          title: recipe.title,
          description: recipe.description,
          ingredients: recipe.ingredients.join(', '),
          steps: recipe.steps.join('\n'),
          prepTime: recipe.prepTime,
          category: recipe.category
        })
      } catch (err) {
        setError('Erreur lors du chargement de la recette')
      } finally {
        setLoading(false)
      }
    }

    fetchRecipe()
  }, [id, isEditMode])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.ingredients.trim() ||
      !formData.steps.trim() ||
      !formData.prepTime ||
      Number(formData.prepTime) <= 0
    ) {
      setError('Veuillez remplir correctement tous les champs')
      return
    }

    const recipeData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      ingredients: formData.ingredients
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item !== ''),
      steps: formData.steps
        .split('\n')
        .map((item) => item.trim())
        .filter((item) => item !== ''),
      prepTime: Number(formData.prepTime),
      category: formData.category
    }

    try {
      setSubmitting(true)

      if (isEditMode) {
        await updateRecipe(id, recipeData)
        navigate(`/recipe/${id}`)
      } else {
        const response = await createRecipe(recipeData)
        navigate(`/recipe/${response.data.id}`)
      }
    } catch (err) {
      setError('Erreur lors de l’enregistrement')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container">
        <p>Chargement...</p>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="form-card">
        <h1>{isEditMode ? 'Modifier une recette' : 'Ajouter une recette'}</h1>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit} className="form">
          <label>Titre</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />

          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />

          <label>Ingrédients</label>
          <input
            type="text"
            name="ingredients"
            value={formData.ingredients}
            onChange={handleChange}
          />

          <label>Étapes</label>
          <textarea
            name="steps"
            value={formData.steps}
            onChange={handleChange}
            rows="6"
          />

          <label>Temps de préparation</label>
          <input
            type="number"
            name="prepTime"
            value={formData.prepTime}
            onChange={handleChange}
          />

          <label>Catégorie</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="entrée">entrée</option>
            <option value="plat">plat</option>
            <option value="dessert">dessert</option>
          </select>

          <div className="actions">
            <button type="submit" className="btn" disabled={submitting}>
              {submitting ? 'Enregistrement...' : isEditMode ? 'Modifier' : 'Ajouter'}
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RecipeFormPage