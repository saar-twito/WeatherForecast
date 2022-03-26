import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import FiveDaysForecast from '../FiveDaysForecast/FiveDaysForecast';
import { CityWeatherState, TemperatureUnits } from '../weather.interfaces';
import { changeTemperatureUnit } from '../weatherSlice';
import './ShowWeatherInfo.scss'

// @Component - responsible for showing weather info (main and forecasts)
const ShowWeatherInfo = () => {

  const weather: CityWeatherState = useAppSelector(state => state.weather);
  const dispatch = useAppDispatch();


  return (
    <>
      {weather.cityName ?
        <div className="main-weather-info-wrapper">

          {/* City and current city's temperature */}
          <div className="city-info">
            <h1>{weather.countryNameShort}, {weather.cityName}</h1>
            <p>{weather.cityWeatherInfo?.WeatherText}</p>
          </div>

          {/* Switch between units (C,F) */}
          <div className='temperature'>
            {weather.temperatureUnit === TemperatureUnits.CELSIUS ?
              <>
                <p className="temperature-value">{weather.cityWeatherInfo.Temperature.Metric.Value.toFixed(0)}</p>
                <sup className="active-unit">&#x2103;</sup>
                <p className="passive-unit" onClick={() => dispatch(changeTemperatureUnit())}>&#x2109;</p>
              </>
              :
              <>
                <p className="temperature-value">{weather.cityWeatherInfo.Temperature.Imperial.Value.toFixed(0)}</p>
                <sup className="active-unit">&#x2109;</sup>
                <p className="passive-unit" onClick={() => dispatch(changeTemperatureUnit())}>&#x2103;</p>
              </>
            }
          </div>

        </div>
        :
        null
      }

      <FiveDaysForecast />

    </>
  )
}

export default ShowWeatherInfo