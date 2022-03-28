import {
  WiCloud,
  WiCloudyWindy,
  WiDayCloudy,
  WiDayHaze,
  WiMoonAltNew,
  WiNightClear,
  WiRainWind,
  WiThunderstorm
} from 'react-icons/wi';
import { useAppSelector } from '../../../app/hooks';
import { CityWeatherState, ForecastDay, TemperatureUnits, TypeOfWeather } from '../weather.interfaces';
import './FiveDaysForecast.scss'

// @Component - responsible for showing 5 days forecast.
const FiveDaysForecast = () => {

  const weather: CityWeatherState = useAppSelector(state => state.weather);


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

  const fahrenheitToCelsius = (fahrenheitMin: number, fahrenheitMax: number): JSX.Element => (
    <p>{((fahrenheitMin - 32) * 5 / 9).toFixed(0)}&#176; / {((fahrenheitMax - 32) * 5 / 9).toFixed(0)}&#176;</p>
  )


  const getWeatherIcon = (day: ForecastDay): JSX.Element => {
    const iconSize = 30;
    const iconColor = "gray"
    const sunIconColor = "#ffec07"

    const getTypeOfWeatherIcon = (hasPrecipitation: boolean, IconPhrase: string) => {
      if (hasPrecipitation) {
        if (IconPhrase.includes(TypeOfWeather.Storm))
          return <WiThunderstorm color={iconColor} size={iconSize} />;
        else
          return <WiRainWind color={iconColor} size={iconSize} />;
      }
      else {
        switch (IconPhrase) {
          case TypeOfWeather.Sunny:
          case TypeOfWeather.MostlySunny:
            return <WiMoonAltNew color={sunIconColor} size={iconSize} />;


          case TypeOfWeather.MostlyClear:
          case TypeOfWeather.Clear:
            return <WiNightClear color={iconColor} size={iconSize} />;


          case TypeOfWeather.PartlyCloudy:
          case TypeOfWeather.PartlySunny:
            return <WiDayCloudy color={iconColor} size={iconSize} />;


          case TypeOfWeather.IntermittentClouds:
          case TypeOfWeather.Cloudy:
          case TypeOfWeather.MostlyCloudy:
            return <WiCloudyWindy color={iconColor} size={iconSize} />;


          case TypeOfWeather.HazySunshine:
            return <WiDayHaze color={iconColor} size={iconSize} />;


          case TypeOfWeather.Dreary:
            return <WiCloud color={iconColor} size={iconSize} />;

        }
      }
    }

    let dayTime = getTypeOfWeatherIcon(day.Day.HasPrecipitation, day.Day.IconPhrase)
    let nightTime = getTypeOfWeatherIcon(day.Night.HasPrecipitation, day.Night.IconPhrase)
 
    return (
      <div className="icon-weather">
        <p>{dayTime}</p>
        <p>{nightTime}</p>
      </div>
    )
  }

  return (
    <div className="five-day-forecast">
      {weather.fiveDaysForecast.DailyForecasts.map((day) => (
        <div className="day" key={day.Date}>

          <header>{handleDateFormat(day.Date)}</header>

          <footer>
            {weather.temperatureUnit === TemperatureUnits.Celsius ?
              fahrenheitToCelsius(day.Temperature.Maximum.Value, day.Temperature.Minimum.Value) :
              <p>{day.Temperature.Maximum.Value.toFixed(0)}&#176; / {day.Temperature.Minimum.Value.toFixed(0)}&#176;</p>}

            {getWeatherIcon(day)}
          </footer>

        </div>
      ))}
    </div>
  )
}

export default FiveDaysForecast