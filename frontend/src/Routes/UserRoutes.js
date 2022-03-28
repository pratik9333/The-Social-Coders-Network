import React, { Fragment } from "react";
import { Routes, Route, Link } from "react-router-dom";

import "../App.css";

//Components
import Signup from "../Components/Signup/Signup";
import Login from "../Components/Login/Login";
import Feeds from "../Components/Feeds/Feeds.jsx";
import Homepage from "../Components/Homepage/Homepage";
import Leaderboard from "../Components/Leaderboard/Leaderboard";
import ProfileDashboard from "../Components/ProfileDashBoard/ProfileDashboard";

//PrivateRoute
import PrivateRoutes from "./PrivateRoutes";

export const UserRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<Signup />} />
        <Route exact path="/profile" element={<PrivateRoutes />}>
          <Route exact path="/profile" element={<ProfileDashboard />} />
        </Route>
        <Route exact path="/feeds" element={<PrivateRoutes />}>
          <Route exact path="/feeds" element={<Feeds />} />
        </Route>
        <Route exact path="/leaderboard" element={<PrivateRoutes />}>
          <Route exact path="/leaderboard" element={<Leaderboard />} />
        </Route>
      </Routes>
    </div>
  );
};
