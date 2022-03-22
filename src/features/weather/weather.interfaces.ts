// When i search for city.
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

// When i give a city key to grab the city temperature.
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

// When i give latitude and longitude to grab the city temperature and general info.
export interface CityInformation {
  AdministrativeArea: {
    ID: string,
    LocalizedName: string
    CountryID: string
  }
  GeoPosition: {
    Elevation: {
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
  }
  WeatherText: string;
}

export interface WeatherState {
  cities: City[]
  query: string;
  cityName: string
  countryNameShort: string
  weatherData: CityWeatherData
  status: 'Loading' | 'Succeed' | 'Filed' | undefined
}