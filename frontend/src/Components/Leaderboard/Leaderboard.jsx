import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { getJWTToken, isAuthenticated } from '../../API/auth';
import "./Leaderboard.scss"
import LeaderboardCard from './LeaderboardCard';
import backend from "../../backend";
import Navbar from '../Navbar/Navbar';
import { LoadingComponent } from '../Loading/Loading';



function Leaderboard() {
  const token = getJWTToken();
  const [loading, setLoading] = useState(false);

  
  

  let user = isAuthenticated();
  const [page, setPage] = useState(1);
  const [usersData, setusersData] = useState([])
const fetchUsers = () => {
  console.log(page);
  setLoading(true);
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
    axios.get(`${backend}/users/leaderboard?page=${page}`,config)
      .then((res) => {
        console.log("leaderboard data : ", res.data);
        let data = res.data.data.filter((usr)=>{
          if(usr._id!==user._id){
            return usr
          }
        })
        setLoading(false);
        setusersData(data);
      }).catch((error) => {
        setLoading(false);
        alert("Cannot able to fetch data");
      })
  }
  useEffect(() => {
    fetchUsers();
  },[])
  return (
    <>
      <Navbar />
      <div id="leaderboard">
        {loading ? <LoadingComponent /> : <div className="container">
            <div className="leaderboard-details">
                <h1>Leaderboard</h1>
                
                {usersData.map((user) => {
          return <LeaderboardCard key={user._id} name={user.name} votes={user.votes} ranking={user.rating} />
        })}
            </div>
        </div>}
    </div>
      </>
  )
}

export default Leaderboard