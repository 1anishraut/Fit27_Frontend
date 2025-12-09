import { createSlice } from "@reduxjs/toolkit";

const AdminbrandDataSlice = createSlice({
  name: "brand",
  initialState: null,
  reducers: {
    addAdminBrandData: (state, action) => {
      return action.payload;
    },
    removeAdminBrandData: (state, action) => {
      return null;
    },
  },
});

export const { addAdminBrandData, removeAdminBrandData } = AdminbrandDataSlice.actions;

export default AdminbrandDataSlice.reducer;
