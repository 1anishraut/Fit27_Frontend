import { createSlice } from "@reduxjs/toolkit";

const brandDataSlice = createSlice({
  name: "brand",
  initialState: null,
  reducers: {
    addBrandData: (state, action) => {
      return action.payload;
    },
    removeBrandData: (state, action) => {
      return null;
    },
  },
});

export const { addBrandData, removeBrandData } = brandDataSlice.actions;

export default brandDataSlice.reducer;
