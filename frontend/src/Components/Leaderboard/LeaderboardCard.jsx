import "./LeaderboardCard.scss"
import React from 'react'

function LeaderboardCard({name,votes,ranking}) {
  return (
    <div id="leaderboard-card">
        <div className="user-name">
            <p></p>
        <h2>{ name}</h2>
        </div>
        <div className="user-ratings">
        <p>Votes: { votes}</p>
        <p className="over-rating">Rating: {Math.round(ranking) }</p>
        </div>
    </div>
  )
}

export default LeaderboardCard