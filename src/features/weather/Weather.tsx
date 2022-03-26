import { useEffect } from 'react'
import ShowWeatherInfo from './ShowWeatherInfo/ShowWeatherInfo'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { getCityWeatherInfo, getFiveDaysWeatherForecast } from './weatherSlice';
import { showErrorNotification } from '../../shared/toastNotification';
import { CityWeatherState } from './weather.interfaces';
import SearchCountry from './SearchCountry/SearchCountry';
import { useLocation } from 'react-router-dom';
import { GoBackToFavoriteCity } from '../favorites/favorites.interfaces';


// @Component - centralize searching city, user location and weather info
const Weather = () => {
  const TEL_AVIV_CITY_KEY = '215854';

  const weather: CityWeatherState = useAppSelector((state) => state.weather)
  const dispatch = useAppDispatch();
  const { state: routerState } = useLocation() as { state?: GoBackToFavoriteCity };

  useEffect(() => {
    if (routerState) {
      getCityInfo(routerState.desireCity);
      getFiveDaysForecastForCity(routerState.cityKey);
      return;
    }
    getCityInfo();
    getFiveDaysForecastForCity();
  }, [])


  const getCityInfo = async (desireCity: string = weather.userQuerySearch) => {
    try {
      // If there is no desired city, use the query search.
      await dispatch(getCityWeatherInfo(desireCity.split(',')[1].trim())).unwrap()

    } catch (e: any) {
      showErrorNotification(e.message)
    }
  }


  const getFiveDaysForecastForCity = async (cityKey: string = weather.cities[0]?.Key || TEL_AVIV_CITY_KEY) => {
    try {
      await dispatch(getFiveDaysWeatherForecast(cityKey)).unwrap();
    } catch (e: any) {
      showErrorNotification(e.message)
    }
  }


  return (
    <>
      <SearchCountry />
      <ShowWeatherInfo />
    </>
  )
}

export default Weather