import {createSlice} from '@reduxjs/toolkit'
const userSlice=createSlice({
    name:"user",
    initialState:{
        user:null,
        isAuthenticated:false,
        links:[]
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
        }
    }
})

export const {setUser,setAuthenticated,setLinks}=userSlice.actions;
export default userSlice.reducer;