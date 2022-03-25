import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { FavoritesCitiesState } from './favorites.interfaces';
import { MdDeleteOutline } from "react-icons/md";
import { removeCityFromFavorite } from './favoritesSlice';
import './Favorites.scss'


const Favorites = () => {

  const { favoriteCities }: FavoritesCitiesState = useAppSelector((state) => state.favorite)
  const dispatch = useAppDispatch();

  const navigate = useNavigate()

  useEffect(() => {
    if (!favoriteCities.length) navigate('/weather');
  }, [])


  const removeCity = (cityKey: string) => {
    if (favoriteCities.length === 1) {
      dispatch(removeCityFromFavorite(cityKey));
      navigate('/weather');
    }
    else {
      dispatch(removeCityFromFavorite(cityKey));
    }
  }


  const handleShowCity = (cityKey: string) => {
    const city = favoriteCities.find(city => city.cityKey === cityKey);
    if (city) {
      navigate('/weather',
        {
          state:
          {
            desireCity: `${city?.countryNameShort}, ${city?.cityName}`,
            cityKey: city?.cityKey
          }

        });
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
                  <h5 className="card-title">{city.countryNameShort}, {city.cityName}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{city.cityWeatherInfo.WeatherText}</h6>
                </div>
                <div>
                  <p className="card-title">{city.cityWeatherInfo.Temperature.Metric.Value}&#x2103;</p>
                  <p className="card-title">{city.cityWeatherInfo.Temperature.Imperial.Value}&#x2109;</p>
                </div>
              </header>
              <p className="card-text">{city.description}</p>
              <footer>
                <a onClick={() => handleShowCity(city.cityKey)} className="card-link">Show 5 days forecast</a>
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