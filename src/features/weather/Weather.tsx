import { useEffect } from 'react'
import ShowInfo from './ShowWeatherInfo/ShowWeatherInfo'
import { BiLocationPlus } from "react-icons/bi";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Weather.scss'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { updateUserQuery/* , isGeolocationAvailable */, getDefaultCity } from './weatherSlice';

const Weather = () => {

  const weather = useAppSelector((state) => state.weather)
  const dispatch = useAppDispatch();


  useEffect(() => {
     // getDefaultLocation()
  }, [])


  const canUserShareItsLocation = () => {
    if (navigator.geolocation) {
    //  dispatch(isGeolocationAvailable(true));
      navigator.geolocation.getCurrentPosition(getUserWeatherLocation);
    }
    else {
     // dispatch(isGeolocationAvailable(false))
      toast.info('Geolocation is not supported by this browser.', {
        position: toast.POSITION.BOTTOM_CENTER, autoClose: 3000,
        hideProgressBar: true
      });
    }
  }


  const getUserWeatherLocation = async (position: GeolocationPosition) => {
    try {
      // await dispatch(getWeatherByUserLocation(position.coords)).unwrap();
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
  const getDefaultLocation = async () => {
    try {
      await dispatch(getDefaultCity(weather.query)).unwrap();
    } catch (e: any) {
      toast.error(e.message, {
        position: toast.POSITION.BOTTOM_CENTER, autoClose: 1500,
        hideProgressBar: true
      });
    }
  }


  const handleCitiesList = async (query: string) => {
    dispatch(updateUserQuery(query))
    try {
      //  await dispatch(getCitiesByQuery(query)).unwrap();
    } catch (e: any) {
      toast.error(e.message, {
        position: toast.POSITION.BOTTOM_CENTER, autoClose: 1500,
        hideProgressBar: true
      });
    }
  }

  return (
    <>
    {console.log('weather',weather)}
      <div className="search-location-wrapper">
        <div className='search-location'>
          {/* <label htmlFor="city-search">search city</label> */}
          <input
            list="countries"
            type='text'
            className="search-input-by-city"
            onChange={(e) => handleCitiesList(e.target.value)}
            placeholder="Search by city name" />

          <datalist id="countries">
            {weather.cities.map((city) => <option key={city.Key} value={city.LocalizedName} />)}

          </datalist>

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
          onClick={() => getDefaultLocation()}>
          Search
        </button>

      </div>

      <ShowInfo />
    </>
  )
}

export default Weather