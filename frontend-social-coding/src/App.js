import "./App.css";
import { useSelector } from "react-redux";
import { LandingPage } from "./pages";
import { NavBar } from "./components";
import { useLocation } from "react-router-dom";

function App() {
  let userDetails = useSelector(state=>state.auth)
  console.log(userDetails)
  let location = useLocation()
  console.log(location.pathname)
  return (
    <div className="w-[100%] min-h-screen">
      <NavBar />
      <LandingPage />
    </div>
  );
}

export default App;
