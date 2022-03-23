import { useEffect } from 'react'
import ShowInfo from './ShowWeatherInfo/ShowWeatherInfo'
import { BiLocationPlus } from "react-icons/bi";
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import {
  updateUserQuery,
  requestDefaultCity,
  getWeatherByUserLocation,
  getCitiesByQuery,
  getWeatherByQuery,
  updateCityDetails
} from './weatherSlice';
import './Weather.scss'
import { showErrorNotification, showInfoNotification } from '../../shared/toastNotification';

const Weather = () => {

  const weather = useAppSelector((state) => state.weather)
  const dispatch = useAppDispatch();


  useEffect(() => {
    sendDefaultCity()
  }, [])


  const isUserGeolocationAvailable = () => {

    // Check if geolocation available
    if (navigator.geolocation) navigator.geolocation.getCurrentPosition(getUserWeatherLocation);
    else showInfoNotification('location share is not supported by this browser.', 3000)

    // Get user location coordinates
    async function getUserWeatherLocation(position: GeolocationPosition) {
      try {
        await dispatch(getWeatherByUserLocation(position.coords)).unwrap();
      } catch (e: any) {
        showErrorNotification(e.message)
      }
    }
  }


  const sendDefaultCity = async () => {
    try {
      await dispatch(requestDefaultCity(weather.userQuerySearch)).unwrap();
    } catch (e: any) {
      showErrorNotification(e.message)
    }
  }


  const handleCitiesListSearch = async (query: string) => {
    dispatch(updateUserQuery(query))

    const city = weather.cities.find(c => `${c.Country.ID}, ${c.LocalizedName}` === query)
    if (city) {
      try {
        dispatch(updateCityDetails(city))
        await dispatch(getWeatherByQuery(city.Key)).unwrap();
      } catch (e: any) {
        showErrorNotification(e.message)
      }
    }
    else {
      try {
        await dispatch(getCitiesByQuery(query)).unwrap();
      } catch (e: any) {
        showErrorNotification(e.message)
      }
    }
  }

  return (
    <>
      <div className="search-location-wrapper">
        <div className='search-location'>
          {/* <label htmlFor="city-search">search city</label> */}
          <input
            list="countries"
            type='text'
            className="search-input-by-city"
            onChange={(e) => handleCitiesListSearch(e.target.value)}
            placeholder="Search by city name" />

          <datalist id="countries">
            {weather.cities?.map((city) => <option key={city.Key} value={`${city.Country.ID}, ${city.LocalizedName}`} />)}
          </datalist>

          <button
            type='button'
            className="my-location"
            onClick={() => isUserGeolocationAvailable()}><BiLocationPlus className="gps" />
            My Location
          </button>
        </div>

        <button
          type="button"
          className="search"
          onClick={() => handleCitiesListSearch(weather.userQuerySearch)}>
          Search
        </button>

      </div>

      <ShowInfo />
    </>
  )
}

export default Weather