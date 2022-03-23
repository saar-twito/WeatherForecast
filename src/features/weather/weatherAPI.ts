import axios from "axios";
import { City, CityInformation, CityWeatherInfo } from "./weather.interfaces";



const api = {
  accuWeather: {
    baseURL: 'http://dataservice.accuweather.com/',
    privateAPIKey: '0fM1A2pOxGhWXZ67VdzmXLbbT8WDnZ48'
  },
  openWeatherMap: {
    baseURL: 'https://api.openweathermap.org/data/2.5/',
    privateAPIKey: 'e585dfa91c450088dd0e65783b0ba410'
  }
};



export const getCitiesByQueryAPI = async (city: string) => {
  try {
    const cities: City[] = await (await axios.get(`${api.accuWeather.baseURL}locations/v1/cities/autocomplete?apikey=${api.accuWeather.privateAPIKey}&q=${city}`)).data;
    return cities
  } catch (error) {
    throw new Error("City not found");
  }
}

export const getDefaultCityWeatherAPI = async (defaultCity: string) => {
  try {
    const cities: City[] = await getCitiesByQueryAPI(defaultCity);
    const cityWeatherData: CityWeatherInfo[] = await geCityWeatherInfoByCityKey(cities[0].Key);
    return {
      cities,
      cityWeatherData
    };
  } catch (error) {
    throw new Error("City weather info is not available");
  }
}

export const geCityWeatherInfoByCityKey = async (cityKey: string) => {
  try {
    const cityWeatherInfo: CityWeatherInfo[] = await (await axios.get(`${api.accuWeather.baseURL}currentconditions/v1/${cityKey}?apikey=${api.accuWeather.privateAPIKey}`)).data;
    return cityWeatherInfo
  } catch (error) {
    throw new Error("City weather info is not available");
  }
}


// export const getWeatherDataByUserLocation = async (latitude: number, longitude: number): Promise<CityInformation> => {
//   try {
//     const cityWeather: CityInformation = await (await axios.get(`${api.accuWeather.baseURL}locations/v1/cities/geoposition/search?apikey=${api.accuWeather.privateAPIKey}&q=${latitude},${longitude}`)).data;
//     return cityWeather
//   } catch (error) {
//     throw new Error("User location not found");
//   }
// }


/***  This openWeatherMap is more accurate than the accuWeather api ***/
export const getWeatherInfoByUserLocation = async (latitude: number, longitude: number) => {
  return await axios.get(`${api.openWeatherMap.baseURL}weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${api.openWeatherMap.privateAPIKey}`);
}



