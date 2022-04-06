export enum TemperatureUnits {
  Celsius = "C",
  Fahrenheit = 'F',
}

export enum TypeOfWeather {
  Hot = "Hot",
  Sunny = "Sunny",
  MostlySunny = "Mostly sunny",
  PartlySunny = "Partly sunny",
  MostlyClear = "Mostly clear",
  Clear = "Clear",
  PartlyCloudy = "Partly cloudy",
  IntermittentClouds = "Intermittent clouds",
  Cloudy = "Cloudy",
  MostlyCloudy = "Mostly cloudy",
  HazySunshine = "Hazy sunshine",
  HazyMoonlight = "Hazy moonlight",
  Dreary = "Dreary",
  Storm = "storms",
}



// When i search for city.
export interface CityGeneralInfo {
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
    CountryID: string,
  },
  EnglishName: string,
  Key: string,
  WeatherText: string;
}


export interface ForecastDay {
  Date: string,
  Day: {
    Icon: number,
    IconPhrase: string,
    HasPrecipitation: boolean
    PrecipitationType?: string,
  }
  Night: {
    Icon: number,
    IconPhrase: string,
    HasPrecipitation: boolean,
    PrecipitationType?: string,
  }
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


export interface FiveDaysCityForecast {
  Headline: {
    Text: string,
  },
  DailyForecasts: ForecastDay[];
}


export interface CityWeatherState {
  cities: CityGeneralInfo[];
  fiveDaysForecast: FiveDaysCityForecast;
  userQuerySearch: string;
  temperatureUnit: TemperatureUnits;
  cityName: string;
  countryNameShort: string;
  cityWeatherInfo: CityWeatherInfo;
  isUserAskedForItsLocation: boolean;
}