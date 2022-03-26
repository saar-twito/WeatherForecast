import { Link } from 'react-router-dom'
import './PageNotFound.scss'

const PageNotFound = () => (
  <div className="page-not-found">
    <h1>Page not found 404</h1>
    <p>Return back to weather page</p>
    <Link replace to="/weather">Go back</Link>
  </div>
)

export default PageNotFound