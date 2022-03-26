import axios from "axios";
import { CityGeneralInfo, CityInformation, CityWeatherInfo, FiveDaysCityForecast } from "./weather.interfaces";


const axiosInstance = axios.create({
  baseURL: 'https://dataservice.accuweather.com/',
  params: {
    apikey: process.env.REACT_APP_ACCUWEATHER_KEY
  },
})


// Get list of cities base on search query
export const getCitiesAutocompleteAPI = async (city: string): Promise<CityGeneralInfo[]> => {
  try {
    const cities: CityGeneralInfo[] = (await axiosInstance.get(`locations/v1/cities/autocomplete`, { params: { q: city } })).data;
    return cities
  } catch (error) {
    throw new Error("City not found.");
  }
}


// Get the weather info of default city (Tel Aviv)
export const getCityWeatherAPI = async (cityName: string): Promise<{ cities: CityGeneralInfo[]; cityWeatherData: CityWeatherInfo[]; }> => {
  try {
    const cities: CityGeneralInfo[] = await getCitiesAutocompleteAPI(cityName);
    const cityWeatherData: CityWeatherInfo[] = await getCityWeatherInfoByCityKeyAPI(cities[0].Key);
    return {
      cities,
      cityWeatherData
    };
  } catch (error) {
    throw new Error("City weather info is not available.");
  }
}


// Get the weather info of of selected city
export const getCityWeatherInfoByCityKeyAPI = async (cityKey: string): Promise<CityWeatherInfo[]> => {
  try {
    const cityWeatherInfo: CityWeatherInfo[] = (await axiosInstance.get(`currentconditions/v1/${cityKey}`)).data;
    return cityWeatherInfo
  } catch (error) {
    throw new Error("City weather info is not available.");
  }
}


export const getFiveDaysForecastAPI = async (cityKey: string): Promise<FiveDaysCityForecast> => {
  try {
    const fiveDaysCityForecast: FiveDaysCityForecast = (await axiosInstance.get(`forecasts/v1/daily/5day/${cityKey}`)).data
    return fiveDaysCityForecast
  } catch (error) {
    throw new Error("Weather forecasts is not available.");
  }

}

// Get the weather info base on user's location'
export const getWeatherInfoByUserLocationAPI = async (latitude: number, longitude: number): Promise<{ cityWeatherInfo: CityWeatherInfo[]; cityInfo: CityInformation; }> => {
  try {
    const cityInfo: CityInformation = (await axiosInstance.get(`locations/v1/cities/geoposition/search`, { params: { q: `${latitude},${longitude}` } })).data;
    const cityWeatherInfo: CityWeatherInfo[] = await getCityWeatherInfoByCityKeyAPI(cityInfo.Key);
    return {
      cityWeatherInfo,
      cityInfo
    }
  } catch (error) {
    throw new Error("User location not found.");
  }
}

