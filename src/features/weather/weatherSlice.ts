import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CityGeneralInfo,
  CityInformation,
  CityWeatherInfo,
  FiveDaysCityForecast,
  TemperatureUnits,
  CityWeatherState
} from "./weather.interfaces";

import {
  getCitiesAutocompleteAPI,
  getCityWeatherAPI,
  getCityWeatherInfoByCityKeyAPI,
  getWeatherInfoByUserLocationAPI,
  getFiveDaysForecastAPI
} from "./weatherAPI";


const initialState: CityWeatherState = {
  cities: [],
  fiveDaysForecast: {
    Headline: {
      Text: ""
    },
    DailyForecasts: [],
  },
  userQuerySearch: "IL, Tel Aviv",
  cityName: "",
  temperatureUnit: TemperatureUnits.CELSIUS,
  countryNameShort: "",
  cityWeatherInfo: {
    Temperature: {
      Metric: {
        Value: 0,
        Unit: "",
        UnitType: ""
      },
      Imperial: {
        Value: 0,
        Unit: "",
        UnitType: "",
      }
    },
    WeatherText: "",
  },
  isUserAskedForItsLocation: false
};


export const getCitiesAutocomplete = createAsyncThunk(
  'weather/getCitiesAutocomplete',
  async (location: string): Promise<CityGeneralInfo[]> => {
    return await getCitiesAutocompleteAPI(location)
  }
)

export const getCityWeatherInfo = createAsyncThunk(
  'weather/getCityWeatherInfo',
  async (defaultCity: string): Promise<{ cities: CityGeneralInfo[]; cityWeatherData: CityWeatherInfo[]; }> => {
    return await getCityWeatherAPI(defaultCity)
  }
)

export const getCityWeatherInfoByCityKey = createAsyncThunk(
  'weather/getCityWeatherInfoByCityKey',
  async (cityKey: string): Promise<CityWeatherInfo[]> => {
    return await getCityWeatherInfoByCityKeyAPI(cityKey)
  }
)


export const getFiveDaysWeatherForecast = createAsyncThunk(
  'weather/getFiveDaysWeatherForecast',
  async (cityKey: string): Promise<FiveDaysCityForecast> => {
    return await getFiveDaysForecastAPI(cityKey)
  }
)

export const getWeatherInfoByUserLocation = createAsyncThunk(
  'weather/getWeatherInfoByUserLocation',
  async (coordinates: { latitude: number, longitude: number }): Promise<{ cityWeatherInfo: CityWeatherInfo[]; cityInfo: CityInformation; }> => {
    return await getWeatherInfoByUserLocationAPI(coordinates.latitude, coordinates.longitude);
  }
)

export const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    updateUserQuery: (state, { payload }: PayloadAction<string>) => {
      state.userQuerySearch = payload
    },

    changeTemperatureUnit: (state) => {
      const { temperatureUnit } = state
      const tempObj = state.cityWeatherInfo.Temperature

      // Celsius => Fahrenheit
      if (temperatureUnit === TemperatureUnits.CELSIUS) {
        state.temperatureUnit = TemperatureUnits.FAHRENHEIT
        if (!tempObj.Imperial.Value.toString()) {
          const temp = tempObj.Imperial.Value;
          tempObj.Imperial.Value = temp * 9 / 5 + 32;
        }
      }

      // Fahrenheit => Celsius
      else if (temperatureUnit === TemperatureUnits.FAHRENHEIT) {
        state.temperatureUnit = TemperatureUnits.CELSIUS
        if (!tempObj.Metric.Value.toString()) {
          const temp = tempObj.Metric.Value;
          tempObj.Metric.Value = (temp - 32) * 5 / 9;
        }
      }
    },

    updateCityGeneralInfo: (state, { payload }: PayloadAction<CityGeneralInfo>) => {
      state.cityName = payload.LocalizedName;
      state.countryNameShort = payload.Country.ID;
    },
    isUserAskedForItsLocation: (state) => {
      state.isUserAskedForItsLocation = true;
    },
  },
  extraReducers: (builder) => {

    builder
      /* Get cities by autocomplete */
      .addCase(getCitiesAutocomplete.fulfilled, (state, { payload }) => {
        state.cities = [...payload];
      })


      /* Get city weather info */
      .addCase(getCityWeatherInfo.fulfilled, (state, { payload }) => {
        const { cities, cityWeatherData } = payload;
        state.cities = [...cities];
        state.cityWeatherInfo.WeatherText = cityWeatherData[0].WeatherText;
        state.cityWeatherInfo.Temperature.Metric = cityWeatherData[0].Temperature.Metric;
        state.cityWeatherInfo.Temperature.Imperial = cityWeatherData[0].Temperature.Imperial;
        state.cityName = cities[0].LocalizedName;
        state.countryNameShort = cities[0].Country.ID;
      })

      /* /* Get user location city weather info */
      .addCase(getWeatherInfoByUserLocation.rejected, (state) => {
        state.isUserAskedForItsLocation = false;
      })
      .addCase(getWeatherInfoByUserLocation.fulfilled, (state, { payload }) => {
        state.isUserAskedForItsLocation = false;
        const { cityWeatherInfo, cityInfo } = payload;
        state.cityWeatherInfo.Temperature = cityWeatherInfo[0].Temperature;
        state.cityWeatherInfo.WeatherText = cityWeatherInfo[0].WeatherText;
        state.cityName = cityInfo.EnglishName;
        state.countryNameShort = cityInfo.AdministrativeArea.CountryID;
        state.userQuerySearch = `${state.countryNameShort}, ${state.cityName}`
      })


      /* Get city weather info by city key */
      .addCase(getCityWeatherInfoByCityKey.fulfilled, (state, { payload }) => {
        state.cityWeatherInfo.WeatherText = payload[0].WeatherText;
        state.cityWeatherInfo.Temperature.Metric = payload[0].Temperature.Metric;
        state.cityWeatherInfo.Temperature.Imperial = payload[0].Temperature.Imperial;
      })

      /* Get 5 days weather forecast */
      .addCase(getFiveDaysWeatherForecast.fulfilled, (state, { payload }) => {
        state.fiveDaysForecast.Headline.Text = payload.Headline.Text
        state.fiveDaysForecast.DailyForecasts = [...payload.DailyForecasts]
      })

  }
});

export const { updateUserQuery, changeTemperatureUnit, updateCityGeneralInfo, isUserAskedForItsLocation } = weatherSlice.actions;

export default weatherSlice.reducer;