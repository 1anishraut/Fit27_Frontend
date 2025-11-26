import { createSlice } from "@reduxjs/toolkit";

const superAdminSlice = createSlice({
  name: "superAdmin",
  initialState: null,
  reducers: {
    addSuperAdmin: (state, action) => {
      return action.payload;
    },
    removeSuperAdmin: (state, action) => {
      return null;
    },
  },
});

export const {addSuperAdmin, removeSuperAdmin} = superAdminSlice.actions

export default superAdminSlice.reducer