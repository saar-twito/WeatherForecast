import { useEffect, useState } from 'react'
import ShowInfo from './ShowWeatherInfo/ShowWeatherInfo'
import { BiLocationPlus } from "react-icons/bi";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Weather.scss'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { getWeatherByUserLocation, getWeatherByQuery, updateUserQuery } from './weatherSlice';

const Weather = () => {
  // const [isGeolocationAvailable, setIsGeolocationAvailable] = useState<boolean>(false)
  const [test, setTest] = useState<boolean>(false)
  const weather = useAppSelector((state) => state.weather)
  const dispatch = useAppDispatch();


  useEffect(() => {
    handleUserSearch()
  }, [])


  const canUserShareItsLocation = () => {
    if (navigator.geolocation) navigator.geolocation.getCurrentPosition(getUserWeatherLocation);
    // else setIsGeolocationAvailable(false) // Geolocation is not supported by this browser.
  }


  const getUserWeatherLocation = async (position: GeolocationPosition) => {
    const { latitude, longitude } = position.coords;

  }


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