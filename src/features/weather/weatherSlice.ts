import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ActionStatus, City, CityInformation, CityWeatherInfo, TemperatureUnits, WeatherState } from "./weather.interfaces";

import { getCitiesByQueryAPI, getDefaultCityWeatherAPI, geCityWeatherInfoByCityKey, getWeatherInfoByUserLocation, /* getWeatherDataByUserLocation */ } from "./weatherAPI";


const initialState: WeatherState = {
  cities: [],
  userQuerySearch: "Tel Aviv",
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
  status: ActionStatus.UNDEFINED,
};


export const getCitiesByQuery = createAsyncThunk(
  'weather/getCitiesByQuery',
  async (location: string): Promise<City[]> => {
    return await getCitiesByQueryAPI(location)
  }
)

export const getDefaultCity = createAsyncThunk(
  'weather/getDefaultCity',
  async (defaultCity: string): Promise<{ cities: City[]; cityWeatherData: CityWeatherInfo[]; }> => {
    return await getDefaultCityWeatherAPI(defaultCity)
  }
)


export const getWeatherByQuery = createAsyncThunk(
  'weather/getWeatherByQuery',
  async (cityKey: string): Promise<CityWeatherInfo[]> => {
    // If getWeatherDataByLocation throws an error
    // We'll immediately move to the getWeatherByQuery.rejected.
    return await geCityWeatherInfoByCityKey(cityKey)
  }
)

/* accuWeather */
// export const getWeatherByUserLocation = createAsyncThunk(
//   'weather/getWeatherDataByUserLocation',
//   async (coordinates: { latitude: number, longitude: number }): Promise<CityInformation> => {
//     const response = await getWeatherDataByUserLocation(coordinates.latitude, coordinates.longitude);
//     console.log("response", response)
//     return response;
//   }
// )

/* openWeatherMap */
export const getWeatherByUserLocation = createAsyncThunk(
  'weather/getWeatherDataByUserLocation',
  async (coordinates: { latitude: number, longitude: number }) => {
    return await (await getWeatherInfoByUserLocation(coordinates.latitude, coordinates.longitude)).data;
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
  },
  extraReducers: (builder) => {

    builder.addCase(getCitiesByQuery.pending, (state) => {
      state.status = ActionStatus.LOADING;
    })
      .addCase(getCitiesByQuery.rejected, (state) => {
        state.status = ActionStatus.FILED;
      })
      // When we get an error like this:  
      // A non-serializable value was detected in action.
      // This means we don't access the data returned to us by createAsyncThunk.
      // for example - state.weatherData.nameOfCity = action.payload.data.name 
      // The line above is wrong because action.payload is already the data that we return.
      // Instead state.weatherData.nameOfCity = action.payload.name will be fine.
      .addCase(getCitiesByQuery.fulfilled, (state, { payload: data }) => {
        state.status = ActionStatus.SUCCEED;
        state.cities = [...data];
      })


      .addCase(getDefaultCity.pending, (state) => {
        state.status = ActionStatus.LOADING;
      })
      .addCase(getDefaultCity.rejected, (state) => {
        state.status = ActionStatus.FILED;
      })
      .addCase(getDefaultCity.fulfilled, (state, { payload: data }) => {
        const { cities, cityWeatherData } = data;
        state.cities = [...cities];
        state.status = ActionStatus.SUCCEED;
        state.cityWeatherInfo.WeatherText = cityWeatherData[0].WeatherText;
        state.cityWeatherInfo.Temperature.Metric = cityWeatherData[0].Temperature.Metric;
        state.cityWeatherInfo.Temperature.Imperial = cityWeatherData[0].Temperature.Imperial;
        state.cityName = cities[0].AdministrativeArea.LocalizedName;
        state.countryNameShort = cities[0].Country.ID;
      })

      /* accuWeather */
      // .addCase(getWeatherByUserLocation.pending, (state) => {
      //   state.status = ActionStatus.LOADING;
      // })
      // .addCase(getWeatherByUserLocation.rejected, (state) => {
      //   state.status = ActionStatus.FILED;
      // })
      // .addCase(getWeatherByUserLocation.fulfilled, (state, { payload: data }) => {
      //   state.status = ActionStatus.SUCCEED
      //   state.weatherData.Temperature = data.GeoPosition.Elevation;
      //   state.cityName = data.AdministrativeArea.LocalizedName;
      //   state.countryNameShort = data.AdministrativeArea.CountryID;
      // })



      /* openWeatherMap */
      .addCase(getWeatherByUserLocation.pending, (state) => {
        state.status = ActionStatus.LOADING;
      })
      .addCase(getWeatherByUserLocation.rejected, (state) => {
        state.status = ActionStatus.FILED;
      })
      .addCase(getWeatherByUserLocation.fulfilled, (state, { payload: data }) => {
        state.status = ActionStatus.SUCCEED;
        state.cityName = data.name;
        state.cityWeatherInfo.Temperature.Metric.Value = data.main.temp;
        state.cityWeatherInfo.Temperature.Imperial.Value = data.main.temp * 9 / 5 + 32;
        state.countryNameShort = data.sys.country;
        state.cityWeatherInfo.WeatherText = data.weather[0].description;
        state.temperatureUnit = TemperatureUnits.CELSIUS;
      })


      .addCase(getWeatherByQuery.pending, (state) => {
        state.status = ActionStatus.LOADING;
      })
      .addCase(getWeatherByQuery.rejected, (state) => {
        state.status = ActionStatus.FILED;
      })
      .addCase(getWeatherByQuery.fulfilled, (state, { payload: data }) => {
        state.status = ActionStatus.SUCCEED;
        state.cityWeatherInfo.WeatherText = data[0].WeatherText;
        state.cityWeatherInfo.Temperature.Metric = data[0].Temperature.Metric;
        state.cityWeatherInfo.Temperature.Imperial = data[0].Temperature.Imperial;
      })
  }
});

export const { updateUserQuery, changeTempUnit, updateCityDetails } = weatherSlice.actions;

export default weatherSlice.reducer;