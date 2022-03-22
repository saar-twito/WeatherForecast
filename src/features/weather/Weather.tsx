import { useEffect, useState } from 'react'
import ShowInfo from './ShowWeatherInfo/ShowWeatherInfo'
import { BiLocationPlus } from "react-icons/bi";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Weather.scss'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { getWeatherByUserLocation, getWeatherByQuery, updateUserQuery, isGeolocationAvailable } from './weatherSlice';

const Weather = () => {

  const weather = useAppSelector((state) => state.weather)
  const dispatch = useAppDispatch();


  useEffect(() => {
    handleUserSearch()
  }, [])


  const canUserShareItsLocation = () => {
    if (navigator.geolocation) {
      dispatch(isGeolocationAvailable(true));
      navigator.geolocation.getCurrentPosition(getUserWeatherLocation);
    }
    else {
      dispatch(isGeolocationAvailable(false))
      toast.info('Geolocation is not supported by this browser.', {
        position: toast.POSITION.BOTTOM_CENTER, autoClose: 3000,
        hideProgressBar: true
      });
    }
  }


  const getUserWeatherLocation = async (position: GeolocationPosition) => {
    try {
      await dispatch(getWeatherByUserLocation(position.coords)).unwrap();
    } catch (e: any) {
      toast.error(e.message, {
        position: toast.POSITION.BOTTOM_CENTER, autoClose: 2000,
        hideProgressBar: true
      });
    }
  }


  // unwrap()  - 
  // dispatched return a promise that has an unwrap property,
  // which can be called to extract the payload of a fulfilled action
  // or to throw either the error 
  const handleUserSearch = async () => {
    try {
      await dispatch(getWeatherByQuery(weather.query)).unwrap();
    } catch (e: any) {
      toast.error(e.message, {
        position: toast.POSITION.BOTTOM_CENTER, autoClose: 1500,
        hideProgressBar: true
      });
    }
  }


  return (
    <>
      <div className="search-location-wrapper">
        <div className='search-location'>
          <input
            list="countries"
            type='text'
            className="search-input-by-city"
            onChange={(e) => dispatch(updateUserQuery(e.target.value))}
            placeholder="Search by city name" />

          <button
            type='button'
            className="my-location"
            onClick={() => canUserShareItsLocation()}><BiLocationPlus className="gps" />
            My Location
          </button>
        </div>

        <button
          type="button"
          className="search"
          onClick={() => handleUserSearch()}>
          Search
        </button>

      </div>

      <ShowInfo />
    </>
  )
}

export default Weather