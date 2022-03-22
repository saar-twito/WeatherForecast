import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { City, CityWeatherData, WeatherState } from "./weather.interfaces";

import { getCitiesByQueryAPI, getDefaultCityWeatherAPI, getWeatherDataByUserLocation, /* getWeatherDataByUserLocation */ } from "./weatherAPI";


const initialState: WeatherState = {
  cities: [],
  query: "Tel Aviv",
  weatherData: {
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
  status: undefined,
};


export const getCitiesByQuery = createAsyncThunk(
  'weather/getCitiesByQuery',
  async (location: string): Promise<City[]> => {
    // If getWeatherDataByLocation throws an error
    // We'll immediately move to the getWeatherByQuery.rejected.
    const result = await getCitiesByQueryAPI(location)
    return result;
  }
)

export const getDefaultCity = createAsyncThunk(
  'weather/getDefaultCity',
  async (defaultCity: string): Promise<{ cities: City[]; cityWeatherData: CityWeatherData[]; }> => {
    // If getWeatherDataByLocation throws an error
    // We'll immediately move to the getWeatherByQuery.rejected.
    const result = await getDefaultCityWeatherAPI(defaultCity)
    return result;
  }
)


export const getWeatherByUserLocation = createAsyncThunk(
  'weather/getWeatherDataByUserLocation',
  async (coordinates: { latitude: number, longitude: number }): Promise<CityWeatherData[]> => {
    const response = await getWeatherDataByUserLocation(coordinates.latitude, coordinates.longitude);
    return response;
  }
)


export const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    updateUserQuery: (state, action) => state.query = action.payload,
    // isGeolocationAvailable: (state, action) => state.isGeolocationAvailable = action.payload
  },
  extraReducers: (builder) => {

    builder.addCase(getCitiesByQuery.pending, (state) => {
      state.status = "Loading";
    })
      .addCase(getCitiesByQuery.rejected, (state) => {
        state.status = "Filed"
      })
      // When we get an error like this:  
      // A non-serializable value was detected in action.
      // This means we don't access the data returned to us by createAsyncThunk.
      // for example - state.weatherData.nameOfCity = action.payload.data.name 
      // The line above is wrong because action.payload is already the data that we return.
      // Instead state.weatherData.nameOfCity = action.payload.name will be fine.
      .addCase(getCitiesByQuery.fulfilled, (state, { payload: data }) => {
        state.status = "Succeed"
        state.cities = [...data]
        // state.weatherData.nameOfCity = data.name;
        // state.weatherData.countryShort = data.sys.country;
        // state.weatherData.description = data.weather[0].description;
        // state.weatherData.temp = data.main.temp;
        // state.weatherData.feelsLike = data.main.feels_like;
        // state.weatherData.tempMax = data.main.temp_max;
        // state.weatherData.tempMin = data.main.temp_min;

      })


      .addCase(getDefaultCity.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(getDefaultCity.rejected, (state) => {
        state.status = "Filed";
      })
      .addCase(getDefaultCity.fulfilled, (state, { payload: data }) => {

        const { cities, cityWeatherData } = data;
        state.cities = [...cities]
        state.status = "Succeed"
        state.weatherData.WeatherText = cityWeatherData[0].WeatherText
        state.weatherData.Temperature.Metric = cityWeatherData[0].Temperature.Metric
        state.weatherData.Temperature.Imperial = cityWeatherData[0].Temperature.Imperial
      })


    // .addCase(getWeatherByUserLocation.pending, (state) => {
    //   state.status = "Loading";
    // })
    // .addCase(getWeatherByUserLocation.rejected, (state) => {
    //   state.status = "Filed";
    // })
    // .addCase(getWeatherByUserLocation.fulfilled, (state, { payload: data }) => {
    //   state.status = "Succeed"
    // })
  }
});

export const { updateUserQuery/* , isGeolocationAvailable */ } = weatherSlice.actions;

export default weatherSlice.reducer;