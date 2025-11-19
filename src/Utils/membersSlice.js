import { createSlice } from "@reduxjs/toolkit";


const membersSlice = createSlice({
  name: "members",
  initialState: null,
  reducers:{
    addMembers: (state, action)=>{
      return action.payload
    },
    removeMembers: (state, action )=>{
      return null
    }
  }
})
export const {addMembers, removeMembers}= membersSlice.actions

export default membersSlice.reducer