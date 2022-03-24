import { BiLocationPlus } from 'react-icons/bi';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { showErrorNotification, showInfoNotification } from '../../../shared/toastNotification';
import { CityWeatherState } from '../weather.interfaces';
import { updateUserQuery, updateCityDetails, getWeatherByQuery, getCitiesByQuery, getWeatherByUserLocation, getFiveDays, isUserAskedForItsLocation } from '../weatherSlice';
import './SearchCountry.scss'

// @Component - responsible for searching city and user location.
const SearchCountry = () => {

  const weather: CityWeatherState = useAppSelector((state) => state.weather)
  const dispatch = useAppDispatch();


  const handleCitiesListSearch = async (query: string) => {
    dispatch(updateUserQuery(query))
    const city = weather.cities.find(c => `${c.Country.ID}, ${c.LocalizedName}` === query)
    if (city) {
      try {
        dispatch(updateCityDetails(city))
        await dispatch(getWeatherByQuery(city.Key)).unwrap();
        await dispatch(getFiveDays(city.Key)).unwrap();
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


  const isUserGeolocationAvailable = () => {

    // Check if geolocation available
    if (navigator.geolocation) navigator.geolocation.getCurrentPosition(getUserWeatherLocation);
    else showInfoNotification('location share is not supported by this browser.', 3000)

    // Get user location coordinates
    async function getUserWeatherLocation(position: GeolocationPosition) {
      dispatch(isUserAskedForItsLocation())
      try {
        const { cityInfo } = await dispatch(getWeatherByUserLocation(position.coords)).unwrap();
        console.log("getUserWeatherLocation ~ result", cityInfo)
        await dispatch(getFiveDays(cityInfo.Key)).unwrap();
      } catch (e: any) {
        showErrorNotification(e.message)
      }
    }
  }



  return (
    <div className="search-location-wrapper">
      <div className='search-location'>
        <input
          list="countries"
          type='text'
          className="search-input-by-city"
          onChange={(e) => handleCitiesListSearch(e.target.value)}
          placeholder="Search by city name" />

        <datalist id="countries">
          {weather.cities?.map((city) => <option key={city.Key} value={`${city.Country.ID}, ${city.LocalizedName}`} />)}
        </datalist>


        {weather.isUserAskedForItsLocation ?

          <button className="btn btn-primary" type="button" disabled>
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Loading...
          </button>

          :

          <button
            type='button'
            className="my-location"
            onClick={() => isUserGeolocationAvailable()}><BiLocationPlus className="gps" />
            My Location
          </button>
        }

      </div>

      <button
        type="button"
        className="search"
        onClick={() => handleCitiesListSearch(weather.userQuerySearch)}>
        Search
      </button>

    </div>

  )
}

export default SearchCountry