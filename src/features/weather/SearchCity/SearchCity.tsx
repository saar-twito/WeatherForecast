import { useEffect, useState } from 'react';
import { BiLocationPlus, BiInfoCircle, BiErrorAlt } from 'react-icons/bi';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { showErrorNotification, showInfoNotification, showSuccessNotification } from '../../../shared/toastNotification';
import { FavoriteCity } from '../../favorites/favorites.interfaces';
import { addCityToFavorite } from '../../favorites/favoritesSlice';
import {
  updateUserQuery,
  updateCityGeneralInfo,
  getCityWeatherInfoByCityKey,
  getCitiesAutocomplete,
  getWeatherInfoByUserLocation,
  getFiveDaysWeatherForecast,
  isUserAskedForItsLocation
} from '../weatherSlice';
import debounce from 'lodash.debounce';
import isAlpha from 'validator/es/lib/isAlpha';
import { motion } from "framer-motion"
import './SearchCity.scss'

// @Component - responsible for searching city and user location.
const SearchCountry = () => {
  const [isEnglish, setIsEnglish] = useState<boolean>(true);
  const [isFirstRendering, setIsFirstRendering] = useState<boolean>(true);

  const { weather, favorite } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => debouncedChangeHandler.cancel();
  }, [])


  const handleCitySearch = async (query: string) => {
    if (isFirstRendering) setIsFirstRendering(false);

    // If user click on option
    if (query.includes(',')) updateState(query);

    // when user typing...
    else if (isAlpha(query, "en-US", { ignore: " " })) {
      setIsEnglish(true);
      updateState(query);
    }

    // if user typing in non-english characters
    else setIsEnglish(false)
  }


  // Updating several things in our state
  const updateState = async (query: string) => {
    dispatch(updateUserQuery(query));
    const city = weather.cities.find(c => `${c.Country.ID}, ${c.LocalizedName}` === query);
    if (city) {
      try {
        dispatch(updateCityGeneralInfo(city));
        dispatch(getCityWeatherInfoByCityKey(city.Key))
        dispatch(getFiveDaysWeatherForecast(city.Key))
      } catch (e: any) {
        showErrorNotification(e.message);
      }
    }
    else {
      try {
        dispatch(getCitiesAutocomplete(query))
      } catch (e: any) {
        showErrorNotification(e.message);
      }
    }
  }

  const debouncedChangeHandler = debounce(handleCitySearch, 500);


  const isUserGeolocationAvailable = () => {
    // Check if geolocation available
    if (navigator.geolocation) navigator.geolocation.getCurrentPosition(getUserWeatherLocation);
    else showInfoNotification('This browser does not support location share.', 3000)
  }

  // Get user location coordinates
  const getUserWeatherLocation = async (position: GeolocationPosition) => {
    dispatch(isUserAskedForItsLocation())

    try {
      const { cityInfo } = await dispatch(getWeatherInfoByUserLocation(position.coords)).unwrap();
      dispatch(getCitiesAutocomplete(cityInfo.EnglishName));
      dispatch(getFiveDaysWeatherForecast(cityInfo.Key));
    } catch (e: any) {
      showErrorNotification(e.message)
    }
  }


  const handleAddingCityToFavorite = () => {
    const { cities, cityName, countryNameShort, cityWeatherInfo, fiveDaysForecast } = weather;
    if (favorite.favoriteCities.find(c => c.cityKey === cities[0].Key))
      showInfoNotification(`${cityName} already added to favorites cities`, 3000)

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


  const handleErrors = () => {

    const messagesVariants = {
      initial: {
        opacity: 0
      },
      animate: {
        opacity: 1,
        transition: {
          duration: 0.3
        }
      }
    }
    // if both of error is true
    if (!weather.cities.length && !isEnglish) {
      return (
        <motion.div
          variants={messagesVariants}
          initial="initial"
          animate="animate"
          className="city-not-found alert alert-info" role="alert">
          <BiInfoCircle /> City not found
        </motion.div>
      )
    }

    // if there is no city
    if (!weather.cities.length) {
      return (
        <motion.div
          variants={messagesVariants}
          initial="initial"
          animate="animate"
          className="city-not-found alert alert-info" role="alert">
          <BiInfoCircle /> City not found
        </motion.div>
      )
    }
    // if the user dont use English
    if (!isEnglish) {
      return (
        <motion.div
          variants={messagesVariants}
          initial="initial"
          animate="animate"
          className="search-error alert alert-danger" role="alert">
          <BiErrorAlt /> Search only in English
        </motion.div>
      )
    }
  }

  return (
    <div className="search-location-wrapper">
      <div className='search-location'>

        {/* User search field */}
        <input
          list="countries"
          type='search'
          className="search-input-by-city"
          onChange={(e) => debouncedChangeHandler(e.target.value)}
          placeholder="Search by city name"
          autoFocus />

        {/* Any errors related to user search */}
        {!isFirstRendering && handleErrors()}

        {/* List of cities base on user search*/}
        <datalist id="countries">
          {weather.cities?.map((city) =>
            <option
              key={city.Key}
              value={`${city.Country.ID}, ${city.LocalizedName}`} />)}
        </datalist>

        {/* User location button */}
        {
          weather.isUserAskedForItsLocation ?
            <button className="my-location-loading" type="button" disabled>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              &nbsp;Loading...
            </button>
            :
            <button
              type='button'
              className="my-location"
              onClick={() => isUserGeolocationAvailable()}>
              <BiLocationPlus className="user-location" />
              My Location
            </button>
        }
      </div>

      <button
        type="button"
        className="save"
        onClick={() => handleAddingCityToFavorite()}>
        Save
      </button>

    </div>
  )
}

export default SearchCountry