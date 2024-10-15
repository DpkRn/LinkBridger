import {createSlice} from '@reduxjs/toolkit'
const pageSlice=createSlice({
    name:"page",
    initialState:{
        sidebarMenu:false,
    },
    reducers:{
        setSidebarMenu:(state,action)=>{
            state.sidebarMenu=action.payload
        },
    }
})

export const {setSidebarMenu}=pageSlice.actions;
export default pageSlice.reducer;