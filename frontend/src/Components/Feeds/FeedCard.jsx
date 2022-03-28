import "./FeedCard.scss"
import React from 'react'

function FeedCard({ user }) {
    return (
        <section id="feedCard-section">
            <div class="card">
                <img src={user.photo.url} alt="Img" />
                <div class="details">
                    <h2>{user.name}</h2>
                    <p>Rating: {Math.round(user.rating)}</p>
                </div>
                <div className="rating-controls">
                    <button className="thumbs-up"><i class="fa-solid fa-thumbs-up"></i></button>
                    <button className="thumbs-down"><i class="fa-solid fa-thumbs-down"></i></button>
                    <button className="add-friend-btn"><i class="fa-solid fa-user-plus"></i></button>
                </div>
            </div>
        </section>
    )
}

export default FeedCard