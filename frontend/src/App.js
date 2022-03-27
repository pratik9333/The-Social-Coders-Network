import './App.css';
import Login from './Components/Login/Login';
import {
  Routes,
  Route,
  Link
} from "react-router-dom";
import Signup from './Components/Signup/Signup';
import Feeds from './Components/Feeds/Feeds';
import Homepage from './Components/Homepage/Homepage';
import Navbar from './Components/Navbar/Navbar';
import { useState } from 'react';
import axios from 'axios';

function App() {

  const [user, setUser] = useState(false)

  if (localStorage.getItem("token")) {
    console.log("token",localStorage.getItem("token"));
    const data = {
      headers: {
        Authorization: "Bearer" + localStorage.getItem("token")
      }
    }
    axios.get("http://localhost:4000/api/v1/user", data)
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.log(err);
      })
  }

  return (
    <div className="App">
      <Navbar user={user} setUser={setUser} />
      {/* <Feeds/> */}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
      </Routes>
    </div>
  );
}

export default App;
