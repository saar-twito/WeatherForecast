import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { City, CityInformation, CityWeatherInfo, FiveDaysForecast, TemperatureUnits, CityWeatherState } from "./weather.interfaces";

import { getCitiesByQueryAPI, getDefaultCityWeatherAPI, getCityWeatherInfoByCityKey, getWeatherInfoByUserLocation, getFiveDaysForecast } from "./weatherAPI";


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


export const getCitiesByQuery = createAsyncThunk(
  'weather/getCitiesByQuery',
  async (location: string): Promise<City[]> => {
    return await getCitiesByQueryAPI(location)
  }
)

export const requestDefaultCity = createAsyncThunk(
  'weather/requestDefaultCity',
  async (defaultCity: string): Promise<{ cities: City[]; cityWeatherData: CityWeatherInfo[]; }> => {
    return await getDefaultCityWeatherAPI(defaultCity)
  }
)

export const getWeatherByQuery = createAsyncThunk(
  'weather/getWeatherByQuery',
  async (cityKey: string): Promise<CityWeatherInfo[]> => {
    return await getCityWeatherInfoByCityKey(cityKey)
  }
)


export const getFiveDays = createAsyncThunk(
  'weather/getFiveDays',
  async (cityKey: string): Promise<FiveDaysForecast> => {
    return await getFiveDaysForecast(cityKey)
  }
)

export const getWeatherByUserLocation = createAsyncThunk(
  'weather/getWeatherDataByUserLocation',
  async (coordinates: { latitude: number, longitude: number }): Promise<{ cityWeatherInfo: CityWeatherInfo[]; cityInfo: CityInformation; }> => {
    return await getWeatherInfoByUserLocation(coordinates.latitude, coordinates.longitude);
  }
)

export const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    updateUserQuery: (state, { payload }: PayloadAction<string>) => { state.userQuerySearch = payload },

    changeTempUnit: (state) => {
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
    updateCityDetails: (state, { payload }: PayloadAction<City>) => {
      state.cityName = payload.LocalizedName;
      state.countryNameShort = payload.Country.ID;
    },
    isUserAskedForItsLocation: (state) => {
      state.isUserAskedForItsLocation = true;
    },
  },
  extraReducers: (builder) => {

    builder
      /* Get cities by query */
      .addCase(getCitiesByQuery.fulfilled, (state, { payload }) => {
        state.cities = [...payload];
      })


      /* Get default city weather */
      .addCase(requestDefaultCity.fulfilled, (state, { payload }) => {
        const { cities, cityWeatherData } = payload;
        state.cities = [...cities];
        state.cityWeatherInfo.WeatherText = cityWeatherData[0].WeatherText;
        state.cityWeatherInfo.Temperature.Metric = cityWeatherData[0].Temperature.Metric;
        state.cityWeatherInfo.Temperature.Imperial = cityWeatherData[0].Temperature.Imperial;
        state.cityName = cities[0].LocalizedName;
        state.countryNameShort = cities[0].Country.ID;
      })

      .addCase(getWeatherByUserLocation.rejected, (state) => {
        state.isUserAskedForItsLocation = false;
      })
      .addCase(getWeatherByUserLocation.fulfilled, (state, { payload }) => {
        state.isUserAskedForItsLocation = false;
        const { cityWeatherInfo, cityInfo } = payload;
        state.cityWeatherInfo.Temperature = cityWeatherInfo[0].Temperature;
        state.cityName = cityInfo.EnglishName;
        state.countryNameShort = cityInfo.AdministrativeArea.CountryID;
        state.userQuerySearch = `${state.countryNameShort}, ${state.cityName}`
      })


      .addCase(getWeatherByQuery.fulfilled, (state, { payload }) => {
        state.cityWeatherInfo.WeatherText = payload[0].WeatherText;
        state.cityWeatherInfo.Temperature.Metric = payload[0].Temperature.Metric;
        state.cityWeatherInfo.Temperature.Imperial = payload[0].Temperature.Imperial;
      })


      .addCase(getFiveDays.fulfilled, (state, { payload }) => {
        state.fiveDaysForecast.Headline.Text = payload.Headline.Text
        state.fiveDaysForecast.DailyForecasts = [...payload.DailyForecasts]
      })

  }
});

export const { updateUserQuery, changeTempUnit, updateCityDetails, isUserAskedForItsLocation } = weatherSlice.actions;

export default weatherSlice.reducer;