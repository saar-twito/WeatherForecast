import { useEffect } from 'react'
import ShowWeatherInfo from './ShowWeatherInfo/ShowWeatherInfo'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { getCityWeatherInfo, getFiveDaysWeatherForecast } from './weatherSlice';
import { showErrorNotification } from '../../shared/toastNotification';
import { CityWeatherState } from './weather.interfaces';
import SearchCountry from './SearchCity/SearchCity';
import { useLocation } from 'react-router-dom';
import { GoBackToFavoriteCity } from '../favorites/favorites.interfaces';


// @Component - centralize searching city, user location, weather info and weather forecast
const Weather = () => {
  const telAvivCityKey = '215854';

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
      dispatch(getCityWeatherInfo(desireCity.split(',')[1].trim()))
    } catch (e: any) {
      showErrorNotification(e.message)
    }
  }


  const getFiveDaysForecastForCity = async (cityKey: string = weather.cities[0]?.Key || telAvivCityKey) => {
    try {
      dispatch(getFiveDaysWeatherForecast(cityKey))
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