import { createSlice } from "@reduxjs/toolkit";


const membersSlice = createSlice({
  name: "members",
  initialState: [],
  reducers:{
    addMembers: (state, action)=>{
      return action.payload
    },
    removeMembers: (state, action )=>{
      return []
    }
  }
})
export const {addMembers, removeMembers}= membersSlice.actions

export default membersSlice.reducer