import axios from "axios";
import { City, CityInformation, CityWeatherData } from "./weather.interfaces";



const api = {
  accuWeather: {
    baseURL: 'http://dataservice.accuweather.com/',
    privateAPIKey: 'AtPEj8Z24vBscCViAWeH1xvgmURskCpc'
  },
  openWeatherMap: {
    baseURL: 'https://api.openweathermap.org/data/2.5/',
    privateAPIKey: 'e585dfa91c450088dd0e65783b0ba410'
  }
};



export const getCitiesByQueryAPI = async (city: string): Promise<City[]> => {
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
    console.log("getDefaultCityWeatherAPI ~ cities", cities)
    const cityWeatherData: CityWeatherData[] = await getWeatherByCityKey(cities[0].Key);
    console.log("getDefaultCityWeatherAPI ~ cityWeatherData", cityWeatherData)
    return {
      cities,
      cityWeatherData
    };
  } catch (error) {
    throw new Error("getDefaultCityAPI Error");
  }
}

export const getWeatherByCityKey = async (locationKey: string): Promise<CityWeatherData[]> => {
  try {
    const cityWeather: CityWeatherData[] = await (await axios.get(`${api.accuWeather.baseURL}currentconditions/v1/${locationKey}?apikey=${api.accuWeather.privateAPIKey}`)).data;
    return cityWeather
  } catch (error) {
    throw new Error("getWeatherByCity Error");
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
export const getWeatherDataByUserLocation = async (latitude: number, longitude: number) => {
  return await axios.get(`${api.openWeatherMap.baseURL}weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${api.openWeatherMap.privateAPIKey}`);
}



