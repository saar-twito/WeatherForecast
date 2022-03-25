import { useEffect } from 'react'
import ShowInfo from './ShowWeatherInfo/ShowWeatherInfo'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { requestDefaultCity, getFiveDays } from './weatherSlice';
import { showErrorNotification } from '../../shared/toastNotification';
import { CityWeatherState } from './weather.interfaces';
import SearchCountry from './SearchCountry/SearchCountry';
import { useLocation } from 'react-router-dom';


// @Component - centralize searching city, user location and weather info
const Weather = () => {

  const weather: CityWeatherState = useAppSelector((state) => state.weather)
  const dispatch = useAppDispatch();
  const { state } = useLocation();

  useEffect(() => {
    if (state) {
      // @ts-ignore
      sendDefaultCity(state.desireCity);
      // @ts-ignore
      getFiveDaysForecastForCity(state.cityKey);
    }
    else {
      // @ts-ignore
      sendDefaultCity();
      // @ts-ignore
      getFiveDaysForecastForCity();
    }

  }, [])


  const sendDefaultCity = async (desireCity?: string) => {
    try {
      if (desireCity) await dispatch(requestDefaultCity(desireCity.split(',')[1].trim())).unwrap();
      else await dispatch(requestDefaultCity(weather.userQuerySearch.split(',')[1].trim())).unwrap();
    
    } catch (e: any) {
      showErrorNotification(e.message)
    }
  }


  const getFiveDaysForecastForCity = async (cityKey?: string) => {
    try {
      if (cityKey) await dispatch(getFiveDays(cityKey)).unwrap();
      else await dispatch(getFiveDays(weather.cities[0]?.Key || '215854')).unwrap();
    
    } catch (e: any) {
      showErrorNotification(e.message)
    }
  }


  return (
    <>
      <SearchCountry />
      <ShowInfo />
    </>
  )
}

export default Weather