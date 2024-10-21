import {createSlice} from '@reduxjs/toolkit'
const userSlice=createSlice({
    name:"user",
    initialState:{
        user:null,
        isAuthenticated:false,
        links:[],
        notifications:0
    },
    reducers:{
        setUser:(state,action)=>{
            state.user=action.payload
        },

        setAuthenticated:(state,action)=>{
            state.isAuthenticated=action.payload
        },
        setLinks:(state,action)=>{
            state.links=action.payload
        },
        setNotifications:(state,action)=>{
            state.notifications=action.payload
        }
    }
})

export const {setUser,setAuthenticated,setLinks,setNotifications}=userSlice.actions;
export default userSlice.reducer;