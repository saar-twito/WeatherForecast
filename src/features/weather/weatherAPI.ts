import axios from "axios";
import { City, CityInformation, CityWeatherInfo, FiveDaysForecast } from "./weather.interfaces";


const api = {
  baseURL: 'http://dataservice.accuweather.com/',
  privateAPIKey: '2jxDR4XfzLy6v8R33PxB2ABTm8UQYYcj'
};



// Get list of cities base on search query
export const getCitiesByQueryAPI = async (city: string): Promise<City[]> => {
  try {
    const cities: City[] = await (await axios.get(`${api.baseURL}locations/v1/cities/autocomplete?apikey=${api.privateAPIKey}&q=${city}`)).data;
    return cities
  } catch (error) {
    throw new Error("City not found");
  }
}


// Get the weather info of default city (Tel Aviv)
export const getDefaultCityWeatherAPI = async (defaultCity: string): Promise<{ cities: City[]; cityWeatherData: CityWeatherInfo[]; }> => {
  try {
    const cities: City[] = await getCitiesByQueryAPI(defaultCity);
    const cityWeatherData: CityWeatherInfo[] = await geCityWeatherInfoByCityKey(cities[0].Key);
    return {
      cities,
      cityWeatherData
    };
  } catch (error) {
    throw new Error("City weather info is not available A");
  }
}


// Get the weather info of of selected city
export const geCityWeatherInfoByCityKey = async (cityKey: string): Promise<CityWeatherInfo[]> => {
  try {
    const cityWeatherInfo: CityWeatherInfo[] = await (await axios.get(`${api.baseURL}currentconditions/v1/${cityKey}?apikey=${api.privateAPIKey}`)).data;
    return cityWeatherInfo
  } catch (error) {
    throw new Error("City weather info is not available B");
  }
}


export const getFiveDaysForecast = async (cityKey: string): Promise<FiveDaysForecast> => {
  try {
    const fiveDaysForecast: FiveDaysForecast = await (await axios.get(`${api.baseURL}forecasts/v1/daily/5day/${cityKey}?apikey=${api.privateAPIKey}`)).data
    return fiveDaysForecast
  } catch (error) {
    throw new Error("Weather forecasts is not available B");
  }

}

// Get the weather info base on user's location'
export const getWeatherInfoByUserLocation = async (latitude: number, longitude: number): Promise<{ cityWeatherInfo: CityWeatherInfo[]; cityInfo: CityInformation; }> => {
  try {
    const cityInfo: CityInformation = await (await axios.get(`${api.baseURL}locations/v1/cities/geoposition/search?apikey=${api.privateAPIKey}&q=${latitude},${longitude}`)).data;
    const cityWeatherInfo: CityWeatherInfo[] = await geCityWeatherInfoByCityKey(cityInfo.Key);
    return {
      cityWeatherInfo,
      cityInfo
    }
  } catch (error) {
    throw new Error("User location not found");
  }
}

