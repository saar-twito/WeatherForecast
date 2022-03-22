import axios from "axios";
import { City, CityWeatherData } from "./weather.interfaces";

// const api = {
//   baseURL: 'https://api.openweathermap.org/data/2.5/',
//   privateAPIKey: 'e585dfa91c450088dd0e65783b0ba410'
// };


// export const getWeatherDataByLocation = async (location: string) => {
//   try {
//     return await axios.get(`${api.baseURL}weather?q=${location}&units=metric&appid=${api.privateAPIKey}`);
//   } catch (error) {
//     throw new Error("City not found");
//   }

// }

// export const getWeatherDataByUserLocation = async (latitude: number, longitude: number) => {
//   try {
//     return await axios.get(`${api.baseURL}weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${api.privateAPIKey}`);
//   } catch (error) {
//     throw new Error("User location not found");
//   }
// }


const api = {
  baseURL: 'http://dataservice.accuweather.com/',
  privateAPIKey: 'uhES8GnXteAv2Uj9Mmt456ABIWXREyyD'
};


export const getCitiesByQueryAPI = async (city: string): Promise<City[]> => {
  try {
    const cities: City[] = await (await axios.get(`${api.baseURL}locations/v1/cities/autocomplete?apikey=${api.privateAPIKey}&q=${city}`)).data;
    return cities
  } catch (error) {
    throw new Error("City not found");
  }
}

export const getDefaultCityWeatherAPI = async (defaultCity: string): Promise<{ cities: City[]; cityWeatherData: CityWeatherData[]; }> => {
  try {
    const cities: City[] = await getCitiesByQueryAPI(defaultCity);
    const cityWeatherData: CityWeatherData[] = await getWeatherByCity(cities[0].Key);
    return {
      cities,
      cityWeatherData
    };
  } catch (error) {
    throw new Error("getDefaultCityAPI Error");
  }
}

export const getWeatherByCity = async (locationKey: string): Promise<CityWeatherData[]> => {
  try {
    const cityWeather: CityWeatherData[] = await (await axios.get(`${api.baseURL}currentconditions/v1/${locationKey}?apikey=${api.privateAPIKey}`)).data;
    return cityWeather
  } catch (error) {
    throw new Error("getWeatherByCity Error");
  }
}


export const getWeatherDataByUserLocation = async (latitude: number, longitude: number): Promise<CityWeatherData[]> => {
  try {
    const cityWeather: CityWeatherData[] = await (await axios.get(`${api.baseURL}locations/v1/cities/geoposition/search?apikey=${api.privateAPIKey}&q=${longitude},${latitude}`)).data;
    return cityWeather
  } catch (error) {
    throw new Error("User location not found");
  }
}



