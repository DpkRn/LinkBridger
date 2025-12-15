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
    }
})

export const {setSidebarMenu, toggleDarkMode, setDarkMode}=pageSlice.actions;
export default pageSlice.reducer;