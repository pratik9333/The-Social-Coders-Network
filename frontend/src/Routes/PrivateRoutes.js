import React from "react";
import { Outlet, Route, Navigate } from "react-router";
import { isAuthenticated } from "../API/auth";

const PrivateRoutes = () => {
  const user = isAuthenticated();
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
