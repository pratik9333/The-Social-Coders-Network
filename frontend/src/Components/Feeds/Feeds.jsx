import "./Feeds.scss"
import React from 'react'
import FeedCard from './FeedCard'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { getJWTToken, isAuthenticated } from "../../API/auth";
import backend from "../../backend"
import Navbar from "../Navbar/Navbar";


function Feeds() {
  const [page, setPage] = useState(1);
  const [feedsData, setFeedsData] = useState([])
  const [loading, setLoading] = useState(false);
  let token = getJWTToken();
  const LoadingComponent = () => {
        return (
          <div id="loading-wrapper">
                <div id="loading-text" style={{color: "black"}}>LOADING</div>
                <div id="loading-content"></div>
          </div>
        )
  }

  const fetchUsers = () => {
    setLoading(true);
    axios.get(`${backend}/users?page=${page}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setLoading(false);
        setFeedsData(res.data.Users);
      }).catch((error) => {
        alert("Cannot able to fetch data");
        setLoading(false);
        seterror(error.response.data.error)
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
    <>
      <Navbar />
      <div className="container feed-container">
      {loading ? <LoadingComponent /> : <>{
        feedsData.map((user) => {
          return <FeedCard key={user._id} user={user} />
        })
      }
      <div className="pagination">
        <button style={{marginRight: "20px"}} onClick={prevPage}>Prev</button>
         <button onClick={nextPage} >Next</button>
      </div></>}
    </div>
      </>
  )
}

export default Feeds