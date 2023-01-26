import "./App.css";
import { useSelector } from "react-redux";
import { LandingPage,LoginPage,SignUpPage } from "./pages";
import { NavBar } from "./components";
import { useLocation} from "react-router-dom";
import { appStates } from "./@types/GlobalStateTypes";

function App() {
  // let userDetails = useSelector((state : appStates)=>state.auth)
  // let location = useLocation()
  return (
    <div className="w-[100%] min-h-screen">
      <NavBar />
      <LandingPage />
      {/* <h1>Helloo</h1> */}
    </div>
  );
}

export default App;
