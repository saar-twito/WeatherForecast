export enum TemperatureUnits {
  CELSIUS = "C",
  FAHRENHEIT = 'F',
}


export enum ActionStatus {
  LOADING = "Loading",
  SUCCEED = "Succeed",
  FILED = "Filed",
  UNDEFINED = "undefined",
}



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
    LocalizedName: string,
  },
}

// When i give a city key to grab the city temperature.
export interface CityWeatherInfo {
  Temperature: {
    Metric: {
      Value: number,
      Unit: string,
      UnitType: string,
    },
    Imperial: {
      Value: number,
      Unit: string,
      UnitType: string,
    },
  }
  WeatherText: string;
}

// When i give latitude and longitude to grab the city temperature and general info.
export interface CityInformation {
  AdministrativeArea: {
    ID: string,
    LocalizedName: string,
    CountryID: string,
  },
  GeoPosition: {
    Elevation: {
      Metric: {
        Value: number,
        Unit: string,
        UnitType: string,
      },
      Imperial: {
        Value: number,
        Unit: string,
        UnitType: string,
      }
    }
  }
  WeatherText: string;
}


export interface Day {
  Date: string,
  Temperature: {
    Minimum: {
      Value: number,
      Unit: "F",
      UnitType: number
    },
    Maximum: {
      Value: number,
      Unit: "F",
      UnitType: number
    }
  },
}


export interface FiveDaysForecast {
  Headline: {
    Text: string,
  },
  DailyForecasts: Day[];

}


export interface CityWeatherState {
  cities: City[];
  fiveDaysForecast: FiveDaysForecast;
  userQuerySearch: string;
  temperatureUnit: TemperatureUnits;
  cityName: string;
  countryNameShort: string;
  cityWeatherInfo: CityWeatherInfo;
  status: ActionStatus;
}