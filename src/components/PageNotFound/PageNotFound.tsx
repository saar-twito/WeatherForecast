import { Link } from 'react-router-dom'
import Routes from '../../shared/routes';
import './PageNotFound.scss'

const PageNotFound = () => {
  return (
    <div className="page-not-found">
      <h1>Page not found 404</h1>
      <p>Return back to weather page</p>
      <Link replace to={Routes.weather}>Go back</Link>
    </div>
  );
}

export default PageNotFound