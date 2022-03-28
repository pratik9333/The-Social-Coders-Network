import "./Feeds.scss"
import React from 'react'
import FeedCard from './FeedCard'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { isAuthenticated } from "../../API/auth";
import backend from "../../backend"


function Feeds() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [feedsData, setFeedsData] = useState([])
  const [loading, setLoading] = useState(false);
  const [error, seterror] = useState();

  let user = isAuthenticated();
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
    axios.get(`${backend}/users?page=${page}`)
      .then((res) => {
        console.log("feeds data : ", res.data);
        let data = res.data.Users.filter((usr)=>{
          if(usr._id!==user._id){
            return usr
          }
        })
        setLoading(false);
        setFeedsData(data);
      }).catch((error) => {
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
  )
}

export default Feeds