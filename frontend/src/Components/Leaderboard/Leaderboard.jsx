import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { getJWTToken, isAuthenticated } from '../../API/auth';
import "./Leaderboard.scss"
import LeaderboardCard from './LeaderboardCard'


function Leaderboard() {
  const token = getJWTToken()
  let user = isAuthenticated();
  const [page, setPage] = useState(1);
  const [usersData, setusersData] = useState([])
const fetchUsers = () => {
  console.log(page);
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
    axios.get(`http://localhost:4000/api/v1/users/leaderboard?page=${page}`,config)
      .then((res) => {
        console.log("leaderboard data : ", res.data);
        let data = res.data.data.filter((usr)=>{
          if(usr._id!==user._id){
            return usr
          }
        })
        setusersData(data);
      })
  }
  useEffect(() => {
    fetchUsers();
  },[])
  return (
    <div id="leaderboard">
        <div className="container">
            <div className="leaderboard-details">
                <h1>Leaderboard</h1>
                
                {usersData.map((user) => {
          return <LeaderboardCard key={user._id} name={user.name} votes={user.votes} ranking={user.rating} />
        })}
            </div>
        </div>
    </div>
  )
}

export default Leaderboard