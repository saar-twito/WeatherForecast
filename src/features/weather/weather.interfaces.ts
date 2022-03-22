export interface City {
  Version: number,
  Key: string,
  Type: string,
  Rank: number,
  LocalizedName: string,
  Country: {
    ID: string,
    LocalizedName: string
  },
  AdministrativeArea: {
    ID: string,
    LocalizedName: string
  }
}

export interface CityWeatherData {
  Temperature: {
    Metric: {
      Value: number
      Unit: string,
      UnitType: string
    },
    Imperial: {
      Value: number
      Unit: string,
      UnitType: string
    }
  }
  WeatherText: string;
}

export interface WeatherState {
  cities: City[]
  query: string;
  weatherData: CityWeatherData
  status: 'Loading' | 'Succeed' | 'Filed' | undefined
}