import React from "react";
import { Route, useNavigate } from "react-router";
import { isAuthenticated } from "../API/auth";

const PrivateRoute = ({ component: Component, ...rest }) => {
  let navigate = useNavigate();
  console.log(isAuthenticated());
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated() ? (
          <Component {...props} />
        ) : (
          navigate("/login", { state: { from: props.location } })
        )
      }
    />
  );
};

export default PrivateRoute;
