import axios, { AxiosError } from "axios";
import { City, CityInformation, CityWeatherInfo, FiveDaysForecast } from "./weather.interfaces";


const api = {
  baseURL: 'http://dataservice.accuweather.com/',
  privateAPIKey: '3aBzHhiDAZbLqkFQ9xxZ93E9hI4AhXNU'
};

const apiAxios = axios.create({
  baseURL: api.baseURL,
  params: {
    apikey : api.privateAPIKey
  },
})


// Get list of cities base on search query
export const getCitiesByQueryAPI = async (city: string): Promise<City[]> => {
  try {
    const cities: City[] = await (await apiAxios.get(`locations/v1/cities/autocomplete`, { params: { q: city } })).data;
    return cities
  } catch (error) {
    throw new Error("City not found");
  }
}


// Get the weather info of default city (Tel Aviv)
export const getDefaultCityWeatherAPI = async (defaultCity: string): Promise<{ cities: City[]; cityWeatherData: CityWeatherInfo[]; }> => {
  try {
    const cities: City[] = await getCitiesByQueryAPI(defaultCity);
    const cityWeatherData: CityWeatherInfo[] = await getCityWeatherInfoByCityKey(cities[0].Key);
    return {
      cities,
      cityWeatherData
    };
  } catch (error) {
    throw new Error("City weather info is not available A");
  }
}


// Get the weather info of of selected city
export const getCityWeatherInfoByCityKey = async (cityKey: string): Promise<CityWeatherInfo[]> => {
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
    const err = error as AxiosError
    console.log("getWeatherInfoByUserLocation ~ error", err)
    throw new Error("Weather forecasts is not available B");
  }

}

// Get the weather info base on user's location'
export const getWeatherInfoByUserLocation = async (latitude: number, longitude: number): Promise<{ cityWeatherInfo: CityWeatherInfo[]; cityInfo: CityInformation; }> => {
  try {
    const cityInfo: CityInformation = await (await axios.get(`${api.baseURL}locations/v1/cities/geoposition/search?apikey=${api.privateAPIKey}&q=${latitude},${longitude}`)).data;
    const cityWeatherInfo: CityWeatherInfo[] = await getCityWeatherInfoByCityKey(cityInfo.Key);
    return {
      cityWeatherInfo,
      cityInfo
    }
  } catch (error) {
    const err = error as AxiosError
    console.log("getWeatherInfoByUserLocation ~ error", err)
    throw new Error("User location not found");
  }
}

