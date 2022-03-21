import React from 'react'
import { useAppSelector } from '../../../app/hooks';
import './ShowWeatherInfo.scss'

const ShowInfo = () => {
  const weather = useAppSelector(state => state.weather.weatherData);

  return (
    <>
      {weather.nameOfCity ? <div className="info-wrapper">
        <div className="info">
          <h1>{weather.nameOfCity}, {weather.countryShort}</h1>
          <p>{weather.description}</p>
        </div>
        <p className='temp'>{weather.temp}&#x2103;</p>
        {(weather.feelsLike === weather.tempMax) && (weather.tempMax === weather.tempMin) ? null :
          <>
            <p>Feels Like: {weather.feelsLike}&#x2103;</p>
            <p>Max: {weather.tempMax}&#x2103;</p>
            <p style={{ marginBottom: '0' }}>Min: {weather.tempMin}&#x2103;</p>
          </>
        }
      </div> : null}

    </>
  )
}

export default ShowInfo