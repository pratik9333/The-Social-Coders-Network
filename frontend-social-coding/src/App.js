import "./App.css";
import { useSelector } from "react-redux";
import { LandingPage } from "./pages";

function App() {
  let userDetails = useSelector(state=>state.auth)
  console.log(userDetails)
  return (
    <div className="w-[100%] min-h-screen">
      <LandingPage />
    </div>
  );
}

export default App;
