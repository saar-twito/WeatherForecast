
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { FavoritesCitiesState } from '../../features/favorites/favorites.interfaces';
import { showErrorNotification } from '../toastNotification';


const NavigationBar = () => {
  const { favoriteCities }: FavoritesCitiesState = useAppSelector((state) => state.favorite)

  const navigate = useNavigate()

  const handleFavoriteNavigation = () => {
    if (!favoriteCities.length) {
      showErrorNotification('Favorite cities is empty, Please add a city to favorites', 3000)
      setTimeout(() => navigate('/weather'), 3000);
    }
  }

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/">Herolo weather app</NavLink>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <NavLink className="nav-link" to="/weather">Weather</NavLink>
              </li>
              <li className="nav-item">
                <NavLink onClick={() => handleFavoriteNavigation()} className="nav-link" to="/favorites">Favorites</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default NavigationBar