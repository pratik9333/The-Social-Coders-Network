import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./store/auth";
import { Provider } from "react-redux";
import {BrowserRouter,Routes,Route} from "react-router-dom"
import { LoginPage,SignUpPage } from "./pages";
const store = configureStore({
    reducer:{
        auth:authSlice.reducer
    }
})

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
      <Provider store ={store}>
          <BrowserRouter>
                <Routes>
                    <Route path="/" element ={<App/>} />
                    <Route path="/Login" element={<LoginPage />} /> 
                    <Route path="/Signup" element={<SignUpPage />} /> 
                </Routes>
          </BrowserRouter>
      </Provider>
      );
