import { useEffect } from 'react'
import ShowInfo from './ShowWeatherInfo/ShowWeatherInfo'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { requestDefaultCity, getFiveDays } from './weatherSlice';
import { showErrorNotification } from '../../shared/toastNotification';
import { CityWeatherState } from './weather.interfaces';
import SearchCountry from './SearchCountry/SearchCountry';


// @Component - centralize searching city, user location and weather info
const Weather = () => {

  const weather: CityWeatherState = useAppSelector((state) => state.weather)
  const dispatch = useAppDispatch();


  useEffect(() => {
    sendDefaultCity()
    getFiveDaysForecastForCity()
  }, [])


  const sendDefaultCity = async () => {
    try {
      await dispatch(requestDefaultCity(weather.userQuerySearch)).unwrap();
    } catch (e: any) {
      showErrorNotification(e.message)
    }
  }


  const getFiveDaysForecastForCity = async () => {
    try {
      await dispatch(getFiveDays(weather.cities[0]?.Key || '215854')).unwrap();
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