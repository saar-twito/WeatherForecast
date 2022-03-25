import { useCallback, useEffect } from 'react';
import { BiLocationPlus } from 'react-icons/bi';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { showErrorNotification, showInfoNotification, showSuccessNotification } from '../../../shared/toastNotification';
import { FavoriteCity } from '../../favorites/favorites.interfaces';
import { addCityToFavorite } from '../../favorites/favoritesSlice';
import { updateUserQuery, updateCityDetails, getWeatherByQuery, getCitiesByQuery, getWeatherByUserLocation, getFiveDays, isUserAskedForItsLocation } from '../weatherSlice';
import debounce from 'lodash.debounce';
import './SearchCountry.scss'

// @Component - responsible for searching city and user location.
const SearchCountry = () => {

  const { weather, favorite } = useAppSelector((state) => state)
  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      debouncedChangeHandler.cancel();
    }
  }, [])
  


  const handleCitiesSearch = async (query: string) => {
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
  
  const debouncedChangeHandler = debounce(handleCitiesSearch, 500);


  const isUserGeolocationAvailable = () => {

    // Check if geolocation available
    if (navigator.geolocation) navigator.geolocation.getCurrentPosition(getUserWeatherLocation);
    else showInfoNotification('This browser does not support location share.', 3000)

    // Get user location coordinates
    async function getUserWeatherLocation(position: GeolocationPosition) {
      dispatch(isUserAskedForItsLocation())

      try {
        const { cityInfo } = await dispatch(getWeatherByUserLocation(position.coords)).unwrap();
        await dispatch(getCitiesByQuery(cityInfo.EnglishName)).unwrap();
        await dispatch(getFiveDays(cityInfo.Key)).unwrap();
      } catch (e: any) {
        console.log("getUserWeatherLocation ~ e", e)
        showErrorNotification(e.message)
      }
    }
  }

  const handleFavoriteCity = () => {
    const { cities, cityName, countryNameShort, cityWeatherInfo, fiveDaysForecast } = weather;
    if (favorite.favoriteCities.find(c => c.cityKey === cities[0].Key)) {
      showInfoNotification(`${cityName} already added to favorites cities`, 3000)
    }
    else {
      const cityToFavorite: FavoriteCity = {
        cityKey: cities[0].Key,
        cityName,
        countryNameShort,
        cityWeatherInfo,
        shortDescription: cityWeatherInfo.WeatherText,
        description: fiveDaysForecast.Headline.Text
      }
      dispatch(addCityToFavorite(cityToFavorite))
      showSuccessNotification(`${cityName} was added to favorites cities`, 3000)
    }
  }

  return (
    <div className="search-location-wrapper">
      <div className='search-location'>
        <input
          list="countries"
          type='text'
          className="search-input-by-city"
          onChange={(e) => debouncedChangeHandler(e.target.value)}
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

      <div className="search-and-save-buttons-wrapper">

        <button
          type="button"
          className="search"
          onClick={() => handleCitiesSearch(weather.userQuerySearch)}>
          Search
        </button>

        <button type="button" className="save" onClick={() => handleFavoriteCity()}>Save</button>
      </div>

    </div>

  )
}

export default SearchCountry