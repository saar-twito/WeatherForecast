import { CityWeatherInfo } from "../weather/weather.interfaces";

export interface FavoriteCity {
  cityKey: string;
  cityName: string;
  countryNameShort: string;
  cityWeatherInfo: CityWeatherInfo
  shortDescription: string;
  description: string;
}


export interface GoBackToFavoriteCity {
  desireCity: string;
  cityKey: string;
}



export interface FavoritesCitiesState {
  favoriteCities: FavoriteCity[]
}