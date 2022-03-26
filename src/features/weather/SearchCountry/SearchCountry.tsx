import { useEffect, useState } from 'react';
import { BiLocationPlus, BiPlus } from 'react-icons/bi';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { showErrorNotification, showInfoNotification, showSuccessNotification } from '../../../shared/toastNotification';
import { FavoriteCity } from '../../favorites/favorites.interfaces';
import { addCityToFavorite } from '../../favorites/favoritesSlice';
import { updateUserQuery, updateCityGeneralInfo, getCityWeatherInfoByCityKey, getCitiesAutocomplete, getWeatherInfoByUserLocation, getFiveDaysWeatherForecast, isUserAskedForItsLocation } from '../weatherSlice';
import debounce from 'lodash.debounce';
import isAlpha from 'validator/es/lib/isAlpha';
import './SearchCountry.scss'

// @Component - responsible for searching city and user location.
const SearchCountry = () => {
  const [isEnglish, setIsEnglish] = useState(true)

  const { weather, favorite } = useAppSelector((state) => state)
  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      debouncedChangeHandler.cancel();
    }
  }, [])


  const handleCitySearch = async (query: string) => {
    // 
    if (query.includes(',')) { // If user click on option
      await updateState();
    }

    else if (isAlpha(query, "en-US", { ignore: " " })) {
      setIsEnglish(true)
      await updateState();
    }
    else {
      setIsEnglish(false)
      console.log('no enflish');
    }


    async function updateState() {
      dispatch(updateUserQuery(query));
      const city = weather.cities.find(c => `${c.Country.ID}, ${c.LocalizedName}` === query);
      if (city) {
        try {
          dispatch(updateCityGeneralInfo(city));
          await dispatch(getCityWeatherInfoByCityKey(city.Key)).unwrap();
          await dispatch(getFiveDaysWeatherForecast(city.Key)).unwrap();
        } catch (e: any) {
          showErrorNotification(e.message);
        }
      }
      else {
        try {
          await dispatch(getCitiesAutocomplete(query)).unwrap();
        } catch (e: any) {
          showErrorNotification(e.message);
        }
      }
    }
  }

  const debouncedChangeHandler = debounce(handleCitySearch, 500);


  const isUserGeolocationAvailable = () => {

    // Check if geolocation available
    if (navigator.geolocation) navigator.geolocation.getCurrentPosition(getUserWeatherLocation);
    else showInfoNotification('This browser does not support location share.', 3000)

    // Get user location coordinates
    async function getUserWeatherLocation(position: GeolocationPosition) {
      dispatch(isUserAskedForItsLocation())

      try {
        const { cityInfo } = await dispatch(getWeatherInfoByUserLocation(position.coords)).unwrap();
        await dispatch(getCitiesAutocomplete(cityInfo.EnglishName)).unwrap();
        await dispatch(getFiveDaysWeatherForecast(cityInfo.Key)).unwrap();
      } catch (e: any) {
        showErrorNotification(e.message)
      }
    }
  }

  const handleAddingCityToFavorite = () => {
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

        <p
          className="search-error">{!isEnglish ?
            <div className="alert alert-info" role="alert">
              Search only in English
            </div>
            :
            null}
        </p>

        <datalist id="countries">
          {weather.cities?.map((city) =>
            <option key={city.Key} value={`${city.Country.ID}, ${city.LocalizedName}`} />)}
        </datalist>


        {weather.isUserAskedForItsLocation ?

          <button className="btn btn-primary" type="button" disabled>
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true">
            </span>
            Loading...
          </button>

          :

          <button
            type='button'
            className="my-location"
            onClick={() => isUserGeolocationAvailable()}><BiLocationPlus className="user-location" />
            My Location
          </button>
        }
      </div>


      <button
        type="button"
        className="save"
        onClick={() => handleAddingCityToFavorite()}>
        <BiPlus /> Save
      </button>


    </div>

  )
}

export default SearchCountry