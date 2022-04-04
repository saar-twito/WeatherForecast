import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { FavoritesCitiesState, GoBackToFavoriteCity } from './favorites.interfaces';
import { MdDeleteOutline } from "react-icons/md";
import { removeCityFromFavorite } from './favoritesSlice';
import { CityWeatherState, TemperatureUnits } from '../weather/weather.interfaces';
import { motion } from "framer-motion"
import './Favorites.scss'

// @Component - responsible for managing favorites cities list
const FavoritesCities = () => {

  const { favoriteCities }: FavoritesCitiesState = useAppSelector((state) => state.favorite)
  const weather: CityWeatherState = useAppSelector((state) => state.weather)
  const dispatch = useAppDispatch();

  const navigate = useNavigate()

  useEffect(() => {
    if (!favoriteCities.length) navigate('/weather');
  }, [])


  const removeCityFromFavoriteCities = (cityKey: string) => {
    if (favoriteCities.length === 1) {
      dispatch(removeCityFromFavorite(cityKey));
      navigate('/weather');
      return
    }
    dispatch(removeCityFromFavorite(cityKey));
  }


  const handleClickOnFiveDaysForecast = (cityKey: string) => {
    const desireCity = favoriteCities.find(city => city.cityKey === cityKey);
    if (desireCity) {
      navigate('/weather',
        {
          state: {
            desireCity: `${desireCity?.countryNameShort}, ${desireCity?.cityName}`,
            cityKey: desireCity?.cityKey
          } as GoBackToFavoriteCity

        });
    }
  }

  return (
    <motion.div className="favorites-cities-wrapper" initial={{ x: '100vw' }} animate={{ x: 0 }} transition={{ duration: 0.7 }}>
      {favoriteCities.map((city) => (
        <div key={city.cityKey} className="card">
          <div className="card-body">
            <header>

              <div>
                <h5 className="card-title">{city.countryNameShort}, {city.cityName}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{city.cityWeatherInfo.WeatherText}</h6>
              </div>

              <div className="temperature">

                {weather.temperatureUnit === TemperatureUnits.Celsius ?
                  <>
                    <p className="card-title">{city.cityWeatherInfo.Temperature.Metric.Value.toFixed(0)}</p>
                    <sup>&#x2103;</sup>
                  </>

                  :
                  <>
                    <p className="card-title">{city.cityWeatherInfo.Temperature.Imperial.Value.toFixed(0)}</p>
                    <sup>&#x2109;</sup>
                  </>
                }
              </div>
            </header>
            <p className="card-text">{city.description}</p>
            <footer>
              
              <motion.button
                whileHover={{ x: 10 }}
                whileTap={{ x: 10 }}
                type="button"
                onClick={() => handleClickOnFiveDaysForecast(city.cityKey)}
                className="card-link">
                Show 5 days forecast
              </motion.button>

              <motion.span whileHover={{ scale: 1.1 }}>
                <MdDeleteOutline onClick={() => removeCityFromFavoriteCities(city.cityKey)} />
              </motion.span>
            </footer>
          </div>
        </div>
      ))}
    </motion.div>
  )
}

export default FavoritesCities