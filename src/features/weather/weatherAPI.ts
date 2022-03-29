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
    return (await axiosInstance.get<CityGeneralInfo[]>(`locations/v1/cities/autocomplete`, { params: { q: city } })).data;
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
    return (await axiosInstance.get<CityWeatherInfo[]>(`currentconditions/v1/${cityKey}`)).data;
  } catch (error) {
    throw new Error("City weather info is not available.");
  }
}

// Get five days weather forecast of selected city
export const getFiveDaysForecastAPI = async (cityKey: string): Promise<FiveDaysCityForecast> => {
  try {
    return (await axiosInstance.get<FiveDaysCityForecast>(`forecasts/v1/daily/5day/${cityKey}`)).data
  } catch (error) {
    throw new Error("Weather forecasts is not available.");
  }

}

// Get the weather info base on user's location'
export const getWeatherInfoByUserLocationAPI = async (latitude: number, longitude: number): Promise<{ cityWeatherInfo: CityWeatherInfo[]; cityInfo: CityInformation; }> => {
  try {
    const cityInfo = (await axiosInstance.get<CityInformation>(`locations/v1/cities/geoposition/search`, { params: { q: `${latitude},${longitude}` } })).data;
    const cityWeatherInfo: CityWeatherInfo[] = await getCityWeatherInfoByCityKeyAPI(cityInfo.Key);
    return {
      cityWeatherInfo,
      cityInfo
    }
  } catch (error) {
    throw new Error("User location not found.");
  }
}

