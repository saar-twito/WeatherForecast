import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FavoriteCity, FavoritesCitiesState } from "./favorites.interfaces";


const initialState: FavoritesCitiesState = {
  favoriteCities: []
};

export const FavoriteCitySlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    addCityToFavorite: (state, { payload }: PayloadAction<FavoriteCity>) => {
      state.favoriteCities.push(payload)
    },

    removeCityFromFavorite: (state, { payload }: PayloadAction<string>) => {
      state.favoriteCities = state.favoriteCities.filter(city => city.cityKey !== payload)
    },
  },
});


export const { addCityToFavorite, removeCityFromFavorite } = FavoriteCitySlice.actions;

export default FavoriteCitySlice.reducer;