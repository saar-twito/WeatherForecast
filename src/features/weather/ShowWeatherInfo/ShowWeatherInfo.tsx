import React from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { TemperatureUnits } from '../weather.interfaces';
import { changeTempUnit } from '../weatherSlice';
import './ShowWeatherInfo.scss'

const ShowInfo = () => {

  const weather = useAppSelector(state => state.weather);
  const dispatch = useAppDispatch();


  return (
    <>
      {weather.cityName ?
        <div className="info-wrapper">

          <div className="info">
            <h1>{weather.cityName}, {weather.countryNameShort}</h1>
            <p>{weather.cityWeatherInfo?.WeatherText}</p>
          </div>

          <div className='temp'>
            {weather.temperatureUnit === TemperatureUnits.CELSIUS ?
              <>
                <p>{weather.cityWeatherInfo.Temperature.Metric.Value.toFixed(1)}&#x2103;</p>
                <p onClick={() => dispatch(changeTempUnit())}>&#x2109;</p>
              </>

              :
              <>
                <p>{weather.cityWeatherInfo.Temperature.Imperial.Value.toFixed(1)}&#x2109;</p>
                <p onClick={() => dispatch(changeTempUnit())}>&#x2103;</p>
              </>}

          </div>

        </div>
        :
        null
      }
    </>
  )
}

export default ShowInfo