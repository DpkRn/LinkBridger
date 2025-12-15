import {createSlice} from '@reduxjs/toolkit'

// Get initial dark mode from localStorage, default to light mode
const getInitialDarkMode = () => {
    const stored = localStorage.getItem('darkMode');
    if (stored !== null) return stored === 'true';
    return false; // Default to light mode
};

const pageSlice=createSlice({
    name:"page",
    initialState:{
        sidebarMenu:false,
        darkMode: getInitialDarkMode(),
        editLinkData: null, // { id, source, destination } when editing
    },
    reducers:{
        setSidebarMenu:(state,action)=>{
            state.sidebarMenu=action.payload
        },
        toggleDarkMode:(state)=>{
            state.darkMode = !state.darkMode;
            localStorage.setItem('darkMode', state.darkMode.toString());
        },
        setDarkMode:(state,action)=>{
            state.darkMode = action.payload;
            localStorage.setItem('darkMode', state.darkMode.toString());
        },
        setEditLinkData:(state,action)=>{
            state.editLinkData = action.payload; // { id, source, destination } or null
        },
        clearEditLinkData:(state)=>{
            state.editLinkData = null;
        },
    }
})

export const {setSidebarMenu, toggleDarkMode, setDarkMode, setEditLinkData, clearEditLinkData}=pageSlice.actions;
export default pageSlice.reducer;