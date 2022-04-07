import "./Feeds.scss"
import React from 'react'
import FeedCard from './FeedCard'
import { useState, useRef, useCallback } from 'react';
import Navbar from "../Navbar/Navbar";
import getFeeds from "./getFeeds";



function Feeds() {
  const [searchtext, setSearchText] = useState('');
  const [PageNumber, setPageNumber] = useState(1);
  const observer = useRef(null);
 
  const LoadingComponent = () => {
        return (
          <div id="loading-wrapper">
                <div id="loading-text" style={{color: "black"}}>LOADING</div>
                <div id="loading-content"></div>
          </div>
        )
  }
  const { error, loading, hasMore, feedsData, moreFeedsLoading } = getFeeds(searchtext, PageNumber);

  const lastFeedElementRef = useCallback(node => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPageNumber(page => page + 1)
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, hasMore])

  const handleQuery = (e) => {
    setSearchText(e.target.value)
    setPageNumber(1);
  }
  return (
    <>
      <Navbar />
      <div className="container feed-container">
        {loading && <LoadingComponent />}
        <div style={{display: "flex", justifyContent: "space-between", width : "100%", marginTop: "25px"}}>
          <h1 style={{ fontSize: "50px", borderBottom: "1px solid #f2f2f2" }}>Feeds</h1>
          <input  className="custom-style-input" type="text" onChange={handleQuery } placeholder="Search Users..." />
        </div>
        <div className="cards-row">
          { feedsData.map((user,index) => {
            if (feedsData.length === index + 1) {
              return <FeedCard ref={lastFeedElementRef} key={user} user={user}  />
            }
            else {
              return <FeedCard key={user._id} user={user} />
            }
        })
          }
        </div>
        {moreFeedsLoading && !loading ? <h2 style={{textAlign: "center", fontSize: "18px"}}>Loading ....</h2> : ""}
        {error ? <h2>{ error}</h2> : ""}
    </div>
      </>
  )
}

export default Feeds