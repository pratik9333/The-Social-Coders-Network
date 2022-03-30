import { isAuthenticated } from "./API/auth";
import "./App.css";
import { UserRoutes } from "./Routes/UserRoutes";

function App() {
  return (
    <div className="App">
      <UserRoutes />
      {/* <Feeds/> */}
    </div>
  );
}

export default App;
