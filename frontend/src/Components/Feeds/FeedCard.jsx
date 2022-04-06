import "./FeedCard.scss"
import React, {forwardRef, useRef} from 'react'

const FeedCard = forwardRef((props, ref) => {
    return (
        <section id="feedCard-section" ref={ref}>
            <div class="card">
                <img src={props.user.photo.url} alt="Img" />
                <div class="details">
                    <h2>{props.user.name}</h2>
                    <p>Rating: {Math.round(props.user.rating)}</p>
                </div>
                <div className="rating-controls">
                    <button className="thumbs-up"><i class="fa-solid fa-thumbs-up"></i></button>
                    <button className="thumbs-down"><i class="fa-solid fa-thumbs-down"></i></button>
                    <button className="add-friend-btn"><i class="fa-solid fa-user-plus"></i></button>
                </div>
            </div>
        </section>
    )
});

export default FeedCard