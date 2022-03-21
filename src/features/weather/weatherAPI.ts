import axios from "axios";

const api = {
  baseURL: 'https://api.openweathermap.org/data/2.5/',
  privateAPIKey: 'e585dfa91c450088dd0e65783b0ba410'
};


export const getWeatherDataByLocation = async (location: string) => {
  try {
    return await axios.get(`${api.baseURL}weather?q=${location}&units=metric&appid=${api.privateAPIKey}`);
  } catch (error) {
    throw new Error("City not found");
  }

}

export const getWeatherDataByUserLocation = async (latitude: number, longitude: number) => {
  try {
    return await axios.get(`${api.baseURL}weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${api.privateAPIKey}`);
  } catch (error) {
    throw new Error("User location not found");
  }
}

