import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import Spinner from '../../../shared/Spinner/Spinner';
import { CityWeatherState, TemperatureUnits } from '../weather.interfaces';
import { changeTempUnit } from '../weatherSlice';
import './ShowWeatherInfo.scss'

const ShowInfo = () => {

  const weather: CityWeatherState = useAppSelector(state => state.weather);
  const dispatch = useAppDispatch();


  const handleDateFormat = (date: string) => {
    const formattedDate = date.substring(5, 10).replace('-', '/');
    const nameOfDay = new Date(date).toDateString().substring(0, 4)

    return (
      <>
        <p>{formattedDate}</p>
        <p>{nameOfDay}</p>
      </>
    )
  }

  const fahrenheitToCelsius = (fahrenheitMin: number, fahrenheitMax: number) => {
    return (
      <p>{((fahrenheitMin - 32) * 5 / 9).toFixed(1)}-{((fahrenheitMax - 32) * 5 / 9).toFixed(1)}</p>
    )
  }


  return (
    <>
      {weather.cityName ?
        <>
          <>
            <div className="info-wrapper">

              {/* City and current city's temperature */}
              <div className="info">
                <h1>{weather.countryNameShort}, {weather.cityName}</h1>
                <p>{weather.cityWeatherInfo?.WeatherText}</p>
              </div>

              {/* Switch between units (C,F) */}
              <div className='temp'>
                {weather.temperatureUnit === TemperatureUnits.CELSIUS ?
                  <>
                    <p>{weather.cityWeatherInfo.Temperature.Metric.Value.toFixed(1)}&#x2103;</p>
                    <p className="unit" onClick={() => dispatch(changeTempUnit())}>&#x2109;</p>
                  </>
                  :
                  <>
                    <p>{weather.cityWeatherInfo.Temperature.Imperial.Value.toFixed(1)}&#x2109;</p>
                    <p className="unit" onClick={() => dispatch(changeTempUnit())}>&#x2103;</p>
                  </>}
              </div>

            </div>
          </>

          <div className="forecast">
            {weather.fiveDaysForecast.DailyForecasts.map((day) => {
              return (
                <div className="day" key={day.Date}>

                  <header>
                    {handleDateFormat(day.Date)}
                  </header>

                  <footer>
                    {weather.temperatureUnit === TemperatureUnits.CELSIUS ?
                      fahrenheitToCelsius(day.Temperature.Minimum.Value, day.Temperature.Maximum.Value) :
                      <p>{day.Temperature.Minimum.Value.toFixed(1)}-{day.Temperature.Maximum.Value.toFixed(1)}</p>
                    }
                  </footer>

                </div>
              )
            })}
          </div>
        </>

        :
        <Spinner />
      }

    </>
  )
}

export default ShowInfo