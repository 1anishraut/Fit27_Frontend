import { createSlice } from "@reduxjs/toolkit";

const adminPlansSlice = createSlice({
  name: "adminPlans",
  initialState: null,
  reducers:{
    addAdminPlans:(state, action)=>{
      return action.payload
    },
    removeAdminPlans: (state, action)=>{
      return null
    }
  }
})

export const {addAdminPlans, removeAdminPlans} = adminPlansSlice.actions

export default adminPlansSlice.reducer