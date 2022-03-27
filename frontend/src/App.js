import { isAuthenticated } from "./API/auth";
import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import { UserRoutes } from "./Routes/UserRoutes";

function App() {
  console.log(isAuthenticated());
  return (
    <div className="App">
      <Navbar />
      <UserRoutes />
      {/* <Feeds/> */}
    </div>
  );
}

export default App;
