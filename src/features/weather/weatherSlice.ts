import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getWeatherDataByLocation, getWeatherDataByUserLocation } from "./weatherAPI";

/* Weather DTO */
export interface WeatherState {
  userLocation: string;
  isGeolocationAvailable: boolean;
  query: string;
  weatherData: {
    nameOfCity: string;
    countryShort: string;
    description: string;
    temp: number;
    feelsLike: number;
    tempMax: number;
    tempMin: number;
  }
  status: 'Loading' | 'Succeed' | 'Filed' | undefined
}

/* Initial State */
const initialState: WeatherState = {
  userLocation: "",
  isGeolocationAvailable: false,
  query: "Tel Aviv",
  weatherData: {
    nameOfCity: "",
    countryShort: "",
    description: "",
    temp: 0,
    feelsLike: 0,
    tempMax: 0,
    tempMin: 0,
  },
  status: undefined,
};

/* Get weather data by query */
export const getWeatherByQuery = createAsyncThunk(
  'weather/getWeatherDataByLocation',
  async (location: string) => {
    // If getWeatherDataByLocation throws an error
    // We'll immediately move to the getWeatherByQuery.rejected.
    const result = await getWeatherDataByLocation(location)
    return result.data;
  }
)

/* Get weather data by user location */
export const getWeatherByUserLocation = createAsyncThunk(
  'weather/getWeatherDataByUserLocation',
  async (coordinates: { latitude: number, longitude: number }): Promise<any> => {
    const response = await getWeatherDataByUserLocation(coordinates.latitude, coordinates.longitude);
    return response?.data;
  }
)


export const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    updateUserQuery: (state, action) => {
      state.query = action.payload;
    },
    isGeolocationAvailable: (state, action) => {
      state.isGeolocationAvailable = action.payload;
    },
  },
  extraReducers: (builder) => {

    builder.addCase(getWeatherByQuery.pending, (state) => {
      state.status = "Loading";
    })
      .addCase(getWeatherByQuery.rejected, (state) => {
        state.status = "Filed"
      })
      // When we get an error like this:  
      // A non-serializable value was detected in action.
      // This means we don't access the data returned to us by createAsyncThunk.
      // for example - state.weatherData.nameOfCity = action.payload.data.name 
      // The line above is wrong because action.payload is already the data that we return.
      // Instead state.weatherData.nameOfCity = action.payload.name will be fine.
      .addCase(getWeatherByQuery.fulfilled, (state, { payload: data }) => {
        state.status = "Succeed"
        state.weatherData.nameOfCity = data.name;
        state.weatherData.countryShort = data.sys.country;
        state.weatherData.description = data.weather[0].description;
        state.weatherData.temp = data.main.temp;
        state.weatherData.feelsLike = data.main.feels_like;
        state.weatherData.tempMax = data.main.temp_max;
        state.weatherData.tempMin = data.main.temp_min;
      })

      .addCase(getWeatherByUserLocation.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(getWeatherByUserLocation.rejected, (state, { payload }) => {
        state.status = "Filed"
      })
      .addCase(getWeatherByUserLocation.fulfilled, (state, { payload: data }) => {
        state.status = "Succeed"
        state.weatherData.nameOfCity = data.name;
        state.weatherData.countryShort = data.sys.country;
        state.weatherData.description = data.weather[0].description;
        state.weatherData.temp = data.main.temp;
        state.weatherData.feelsLike = data.main.feels_like;
        state.weatherData.tempMax = data.main.temp_max;
        state.weatherData.tempMin = data.main.temp_min;
      })
  }
});

export const { updateUserQuery, isGeolocationAvailable } = weatherSlice.actions;

export default weatherSlice.reducer;