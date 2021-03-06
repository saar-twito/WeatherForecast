import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from '../features/weather/weatherSlice';
import FavoriteCityReducer from '../features/favorites/favoritesSlice';

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    favorite: FavoriteCityReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
