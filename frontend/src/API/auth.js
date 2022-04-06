import API from "../backend";

export const signout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    return fetch(`http://localhost:4000/api/v1/signout`, {
      method: "GET",
    })
      .then((response) => {
        console.log("Signout Success");
      })
      .catch((err) => console.log("ERROR"));
  }
};

export const isAuthenticated = () => {
  if (typeof window == "undefined") {
    return false;
  }
  if (localStorage.getItem("token")) {
    return JSON.parse(localStorage.getItem("user"));
  } else {
    return false;
  }
};

export const getJWTToken = () => {
  if (typeof window == "undefined") {
    return false;
  }
  if (localStorage.getItem("token")) {
    return JSON.parse(localStorage.getItem("token"));
  } else {
    return false;
  }
};

export const authenticate = (user, token, next) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", JSON.stringify(token));
    next();
  }
};
