import "./FeedCard.scss"
import React, {forwardRef} from 'react'
import axios from "axios";
import { getJWTToken, isAuthenticated } from "../../API/auth";

import backend from "../../backend";

const FeedCard = forwardRef((props, ref) => {

    const token = getJWTToken();
    const loggedUser = isAuthenticated()

    const rateUser = (action,userId) => {
        axios({
            method: "PUT",
            url: `${backend}/user/rate/${action}/${userId}`,
            headers: { Authorization: `Bearer ${token}` },
        }).then((response) => {
            alert(response.data.message);
        }).catch((error) => {
            alert(error.response.data.error);
        })
    }

    const sendFriendRequest = (userId) => {
        axios({
            method: "PUT",
            url: `${backend}/user/request/friend/${userId}`,
            headers: { Authorization: `Bearer ${token}` },
        }).then((response) => {
            alert(response.data.message);
        }).catch((error) => {
            alert(error.response.data.error);
        })
    }
    return (
        <section id="feedCard-section" ref={ref}>
            <div class="card">
                <img src={props.user.photo.url} alt="Img" />
                <div class="details">
                    <h2>{props.user.name}</h2>
                    <p>Rating: {Math.round(props.user.rating)}</p>
                </div>
                <div className="rating-controls">
                    <button className="thumbs-up" onClick={() => rateUser("upvote", props.user._id)}><i class="fa-solid fa-thumbs-up"></i></button>
                    <button className="thumbs-down" onClick={() => rateUser("downvote",props.user._id)}><i class="fa-solid fa-thumbs-down"></i></button>
                    {props.user.friendRequests.length > 0 ? props.user.friendRequests.map((userIds) => {
                        if (userIds.toString() === loggedUser._id.toString()) {
                            return <button key={userIds} disabled={true} className="sent-friend-req-btn"><i class="fa-solid fa-user-clock"></i></button>
                        }
                        else {
                            return <button className="add-friend-btn" onClick={() => sendFriendRequest(props.user._id)}><i class="fa-solid fa-user-plus"></i></button>
                        }
                    }) : <button className="add-friend-btn" onClick={() => sendFriendRequest(props.user._id)}><i class="fa-solid fa-user-plus"></i></button>}
                </div>
            </div>
        </section>
    )
});

export default FeedCard;