import "./Feeds.scss"
import React from 'react'
import FeedCard from './FeedCard'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { isAuthenticated } from "../../API/auth";

function Feeds() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [feedsData, setFeedsData] = useState([])

  let user = isAuthenticated();

  const fetchUsers = () => {
    axios.get(`http://localhost:4000/api/v1/users?page=${page}`)
      .then((res) => {
        console.log("feeds data : ", res.data);
        let data = res.data.Users.filter((usr)=>{
          if(usr._id!==user._id){
            return usr
          }
        })
        console.log(data);
        setFeedsData(data);
      })
  }

  const prevPage = () => {
    if (page > 1) {
      setPage(page-1);
    }
     fetchUsers();
    
  }

  const nextPage = () => {
    setPage(page+1);
    setTimeout(() => {
      fetchUsers();
    }, 1500);
  }

  useEffect(() => {
    
    setPage(1);
    fetchUsers();
  }, []);

  return (
    <div className="container feed-container">
      {
        feedsData.map((user) => {
          return <FeedCard key={user._id} user={user} />
        })
      }
      <div className="pagination">
        <button style={{marginRight: "20px"}} onClick={prevPage}>Prev</button>
         <button onClick={nextPage} >Next</button>
      </div>
    </div>
  )
}

export default Feeds