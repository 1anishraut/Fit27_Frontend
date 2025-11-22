import { createSlice } from "@reduxjs/toolkit";

const classesSlice = createSlice({
  name: "classes",
  initialState: null,
  reducers:{
    addClasses:(state, action)=>{
      return action.payload
    },
    removeClasses: (state, action)=>{
      return null
    }
  }
})

export const {addClasses, removeClasses} = classesSlice.actions

export default classesSlice.reducer