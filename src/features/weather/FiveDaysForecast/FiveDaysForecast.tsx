import { WiCloud, WiCloudyWindy, WiDayCloudy, WiDayHaze, WiMoonAltNew, WiNightClear, WiRainWind, WiThunderstorm } from 'react-icons/wi';
import { useAppSelector } from '../../../app/hooks';
import { CityWeatherState, ForecastDay, TemperatureUnits } from '../weather.interfaces';
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



  const getWeatherIcon = (day: ForecastDay) => {
    const iconSize = 30;
    const iconColor = "gray"

    let dayTime: any;
    let nightTime: any;

    getDayWeatherIcon();


    getNightWeatherIcon();

    return (
      <div className="icon-weather">
        <p>{dayTime}</p>
        <p>{nightTime}</p>
      </div>
    )


    function getNightWeatherIcon() {
      if (day.Night.HasPrecipitation) {
        if (day.Night.IconPhrase.includes('storms'))
          nightTime = <WiThunderstorm color={iconColor} size={iconSize} />;
        else
          nightTime = <WiRainWind color={iconColor} size={iconSize} />;
      }
      else {
        switch (day.Night.IconPhrase) {
          case "Mostly clear":
          case "Clear":
            nightTime = <WiNightClear color={iconColor} size={iconSize} />;
            break;

          case "Partly cloudy":
            nightTime = <WiDayCloudy color={iconColor} size={iconSize} />;
            break;

          case "Intermittent clouds":
          case "Cloudy":
          case "Mostly cloudy":
            nightTime = <WiCloudyWindy color={iconColor} size={iconSize} />;
            break;

          case "Hazy sunshine":
            nightTime = <WiDayHaze color={iconColor} size={iconSize} />;
            break;

          case "Dreary":
            nightTime = <WiCloud color={iconColor} size={iconSize} />;
            break;
        }
      }
    }

    function getDayWeatherIcon() {
      if (day.Day.HasPrecipitation) {
        if (day.Day.IconPhrase.includes('storms'))
          dayTime = <WiThunderstorm color={iconColor} size={iconSize} />;
        else
          dayTime = <WiRainWind color={iconColor} size={iconSize} />;
      }
      else {
        switch (day.Day.IconPhrase) {
          case "Sunny":
          case "Mostly sunny":
            dayTime = <WiMoonAltNew color='#ffec07' size={iconSize} />;
            break;

          case "Mostly clear":
          case "Clear":
            dayTime = <WiNightClear color={iconColor} size={iconSize} />;
            break;

          case "Partly cloudy":
            dayTime = <WiDayCloudy color={iconColor} size={iconSize} />;
            break;

          case "Intermittent clouds":
          case "Cloudy":
          case "Mostly cloudy":
            dayTime = <WiCloudyWindy color={iconColor} size={iconSize} />;
            break;

          case "Hazy sunshine":
            dayTime = <WiDayHaze color={iconColor} size={iconSize} />;
            break;

          case "Dreary":
            dayTime = <WiCloud color={iconColor} size={iconSize} />;
            break;
        }
      }
    }
  }

  return (
    <div className="five-day-forecast">
      {weather.fiveDaysForecast.DailyForecasts.map((day) => (
        <div className="day" key={day.Date}>

          <header>{handleDateFormat(day.Date)}</header>

          <footer>
            {weather.temperatureUnit === TemperatureUnits.CELSIUS ?
              fahrenheitToCelsius(day.Temperature.Minimum.Value, day.Temperature.Maximum.Value) :
              <p>{day.Temperature.Minimum.Value.toFixed(0)}&#176; / {day.Temperature.Maximum.Value.toFixed(0)}&#176;</p>}

            {getWeatherIcon(day)}
          </footer>

        </div>
      ))}
    </div>
  )
}

export default FiveDaysForecast