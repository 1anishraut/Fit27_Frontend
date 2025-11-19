import { createSlice } from "@reduxjs/toolkit";

const plansSlice = createSlice({
  name: "plans",
  initialState: null,
  reducers:{
    addPlans:(state, action)=>{
      return action.payload
    },
    removePlans: (state, action)=>{
      return null
    }
  }
})

export const {addPlans, removePlans} = plansSlice.actions

export default plansSlice.reducer