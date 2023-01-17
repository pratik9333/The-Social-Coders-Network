import {createSlice } from "@reduxjs/toolkit"


const authSlice = createSlice({
    name:"userDetails",
    initialState:{
           isloggedIn:false,
           currentUser:undefined,
    },
    reducers:{
            setcurrentUser(state,action){
                const { user } = action.payload
                state.isloggedIn = true
                state.currentUser = user
            }
    }
})


export const actions = authSlice.actions
export default authSlice