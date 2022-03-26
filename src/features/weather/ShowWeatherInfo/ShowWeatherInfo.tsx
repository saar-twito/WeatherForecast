import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { CityWeatherState, TemperatureUnits } from '../weather.interfaces';
import { changeTemperatureUnit } from '../weatherSlice';
import { WiMoonAltNew, WiCloudy, WiRainWind, WiSnowflakeCold } from "react-icons/wi";
import './ShowWeatherInfo.scss'

const ShowWeatherInfo = () => {
  const weather: CityWeatherState = useAppSelector(state => state.weather);
  const dispatch = useAppDispatch();


  const handleDateFormat = (date: string): JSX.Element => {
    const formattedDate = date.substring(5, 10).replace('-', '/');
    const nameOfDay = new Date(date).toDateString().substring(0, 4)

    return (
      <>
        <p>{formattedDate}</p>
        <p>{nameOfDay}</p>
      </>
    )
  }

  const fahrenheitToCelsius = (fahrenheitMin: number, fahrenheitMax: number): JSX.Element => {
    return (
      <p>{((fahrenheitMin - 32) * 5 / 9).toFixed(0)}&#176; / {((fahrenheitMax - 32) * 5 / 9).toFixed(0)}&#176;</p>
    )
  }



  // const getWeatherIcon = (tempa) => {
    
  // }

  return (
    <>
      {weather.cityName ?
        <>
          <>
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
                    <p className="temperature-value">{weather.cityWeatherInfo.Temperature.Metric.Value.toFixed(0)}
                    </p>
                    <sup className="active-unit">&#x2103;</sup>
                    <p className="passive-unit" onClick={() => dispatch(changeTemperatureUnit())}>&#x2109;</p>
                  </>
                  :
                  <>
                    <p className="temperature-value">{weather.cityWeatherInfo.Temperature.Imperial.Value.toFixed(0)}
                    </p>
                    <sup className="active-unit">&#x2109;</sup>
                    <p className="passive-unit" onClick={() => dispatch(changeTemperatureUnit())}>&#x2103;</p>
                  </>}
              </div>

            </div>
          </>

          <div className="five-day-forecast">
            {weather.fiveDaysForecast.DailyForecasts.map((day) => {
              return (
                <div className="day" key={day.Date}>

                  <header>
                    {handleDateFormat(day.Date)}
                  </header>

                  <footer>
                    {weather.temperatureUnit === TemperatureUnits.CELSIUS ?
                      fahrenheitToCelsius(day.Temperature.Minimum.Value, day.Temperature.Maximum.Value) :
                      <p>{day.Temperature.Minimum.Value.toFixed(0)}&#176; / {day.Temperature.Maximum.Value.toFixed(0)}&#176;</p>
                    }

                    {/* {getWeatherIcon(day.Temperature)}
                    <WiMoonAltNew /> */}
                  </footer>

                </div>
              )
            })}
          </div>
        </>

        :

        null
      }

    </>
  )
}

export default ShowWeatherInfo