import React from 'react'
import { useAppSelector } from '../../../app/hooks';
import './ShowWeatherInfo.scss'

const ShowInfo = () => {
  const weather = useAppSelector(state => state.weather);

  return (
    <>
      {weather.cityName ? <div className="info-wrapper">
        <div className="info">
          <h1>{weather.cityName}, {weather.countryNameShort}</h1>
          <p>{weather.weatherData?.WeatherText}</p>
        </div>
        <p className='temp'>{weather.weatherData.Temperature.Metric.Value}&#x2103;</p>
      </div> : null}

    </>
  )
}

export default ShowInfo