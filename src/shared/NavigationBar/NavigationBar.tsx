
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { FavoritesCitiesState } from '../../features/favorites/favorites.interfaces';
import { showInfoNotification } from '../toastNotification';


const NavigationBar = () => {
  const { favoriteCities }: FavoritesCitiesState = useAppSelector((state) => state.favorite)

  const handleFavoriteNavigation = (e: any) => {
    if (!favoriteCities.length) {
      showInfoNotification('Favorite cities are empty. Please add a city to favorites.', 3000)
      e.preventDefault()
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
                <NavLink onClick={(e) => handleFavoriteNavigation(e)} className="nav-link" to="/favorites">Favorites</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default NavigationBar