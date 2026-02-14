import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    isAuthenticated: false,
    user: null,
    isLoading: true,
    error: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart(state) {
            state.isLoading = true
            state.error = null
        },
        loginSuccess(state, action) {
            state.isLoading = false
            state.isAuthenticated = true
            state.user = action.payload
        },
        loginFailure(state, action) {
            state.isLoading = false
            state.error = action.payload
        },
       
        logout(state) {
            state.isAuthenticated = false
            state.user = null
            state.isLoading = false
            state.error = null
           
        }
    
    },
})

export const {loginStart, loginSuccess, loginFailure, logout,setProfileComplete } = authSlice.actions



export default authSlice.reducer