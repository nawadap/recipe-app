import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="container">
      <div className="detail-card">
        <h1>404</h1>
        <p>Page introuvable</p>
        <Link to="/" className="btn">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage