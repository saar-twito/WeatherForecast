import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { FavoritesCitiesState } from './favorites.interfaces';
import { MdDeleteOutline } from "react-icons/md";
import './Favorites.scss'
import { removeCityFromFavorite } from './favoritesSlice';


const Favorites = () => {

  const { favoriteCities }: FavoritesCitiesState = useAppSelector((state) => state.favorite)
  const dispatch = useAppDispatch();
  
  const navigate = useNavigate()

  const removeCity = (cityKey: string) => {
    if (favoriteCities.length === 1) {
      dispatch(removeCityFromFavorite(cityKey));
      navigate('/weather');
    }
    

  }

  return (
    <div className="favorites-cities-wrapper">
      {favoriteCities.map((city) => {
        return (
          <div key={city.cityKey} className="card">
            <div className="card-body">
              <header>
                <div>
                  <h5 className="card-title">{city.cityName}, {city.countryNameShort}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{city.cityWeatherInfo.WeatherText}</h6>
                </div>
                <p className="card-title">{city.cityWeatherInfo.Temperature.Metric.Value}</p>
              </header>
              <p className="card-text">{city.description}</p>
              <footer>
                <Link className="card-link" to="/weather">Show 5 days forecast</Link>
                <MdDeleteOutline onClick={() => removeCity(city.cityKey)} />
              </footer>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Favorites