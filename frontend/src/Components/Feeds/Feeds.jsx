import React from 'react'
import FeedCard from './FeedCard'
import "./Feeds.scss"

function Feeds() {
  return (
    <div className="container feed-container">
        <FeedCard/>
        <FeedCard/>
        <FeedCard/>
        <FeedCard/>
        <FeedCard/>
    </div>
  )
}

export default Feeds