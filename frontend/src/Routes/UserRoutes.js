import React, { Fragment } from "react";
import { Routes, Route, Link } from "react-router-dom";

import "../App.css";

//Components
import Signup from "../Components/Signup/Signup";
import Login from "../Components/Login/Login";
import Feeds from "../Components/Feeds/Feeds";
import Homepage from "../Components/Homepage/Homepage";

//PrivateRoute
import PrivateRoutes from "./PrivateRoutes";

export const UserRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
};
