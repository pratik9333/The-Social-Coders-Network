import "./App.css";
import { useSelector } from "react-redux";
import { LandingPage,LoginPage,SignUpPage } from "./pages";
import { NavBar } from "./components";
import { useLocation,Route, Router ,Routes } from "react-router-dom";

function App() {
  let userDetails = useSelector(state=>state.auth)
  let location = useLocation()
  return (
    <div className="w-[100%] min-h-screen">
      <NavBar />
      <LandingPage />
    </div>
  );
}

export default App;
