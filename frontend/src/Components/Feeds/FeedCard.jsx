import React from 'react'
import "./FeedCard.scss"

function FeedCard() {
    return (
        <section id="feedCard-section">
            <div class="card">
                <img src="https://res.cloudinary.com/pratikaswani/image/upload/v1648303126/users/qs2w2hrzktufhu1sdmxr.jpg" alt="Img"/>
                <div class="details">
                    <h2>Stevie Blight</h2>
                    <p>Overall Rating: 4</p>
                </div>
                <p className="info">{"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.".substring(0, 101)}{"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.".length < 100 ? "" : "..."}</p>
                <div className="rating-controls">
                    <button className="thumbs-up"><i class="fa-solid fa-thumbs-up"></i></button>
                    <button className="thumbs-down"><i class="fa-solid fa-thumbs-down"></i></button>
                </div>
            </div>
        </section>
    )
}

export default FeedCard