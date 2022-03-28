import "./ProfileDashboard.scss"
import React, { useEffect } from 'react'
import { useState } from "react"
import { getJWTToken, isAuthenticated } from "../../API/auth";
import axios from "axios";



function ProfileDashboard() {

    let user = isAuthenticated();
   

    const fetchPlatformDetails = (platform,platform2) => {
         let token = getJWTToken()
         const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
        if (platform === "leetcode") {
            axios.post(`http://localhost:4000/api/v1/platform/${platform}`, { leetcodeId: UserPlatformDetails.leetcodeId },config)
                .then((res) => {
                    console.log("userdata", res.data);
                })
                .catch((err) => {
                    console.log(err.response.data.message);
                })
        }
        else {
            axios.post(`http://localhost:4000/api/v1/platform/${platform}/${UserPlatformDetails.codeforcesId}`, { codeforcesId: UserPlatformDetails.codeforcesId },config)
                .then((res) => {
                    console.log("userdata", res.data);
                })
            .catch((err) => {
                    console.log(err);
                })
        }
    }
    


    const [hasleetcode, sethasleetcode] = useState(false);
    const [hascodeforces, sethascodeforces] = useState(false);
    const [UserPlatformDetails, setUserPlatformDetails] = useState({
        leetcodeId: "",
        codeforcesId: "",
    })

    const LeetCodeDetails = () => {
        
        return (
            <div className="leetcode-details">
                <h1>leetcode details</h1>

            </div>
        )
    }

    const CodeforcesDetails = () =>{
        return (
            <div className="codeforces-details">
                <h1>codeforces details</h1>
            </div>
        )
    }

    const submitDetails = (platform) => {
        fetchPlatformDetails(platform);
    }

    useEffect(() => {
        
    })

    return (
        <section id="profile-dashboard">
            <div className="container">
                <div className="profile-details">
                    <div class="profilecont">
                        <div class="ava">
                            <img src={user.photo.url} alt="ava" />
                            <h4>{ user.name}</h4>
                        </div>
                        <div class="profile-info">
                            <ul style={{listStyle: "none"}}>
                                <li>Email: <span>{user.email}</span></li>
                                <li>Rating : <span>{Math.round(user.rating)}</span></li>
                                <li>friends: <span>{user.friends.length == 0 ? "nill" : user.friends.length}</span></li>
                            </ul>
                        </div>
                    </div>
                    <hr />
                    <div className="bottom-part">
                        {!hasleetcode && <div>
                            <label htmlFor="leetcode">Leetcode ID: </label>
                            <input type="text" onChange={(e) => {
                                setUserPlatformDetails({...UserPlatformDetails, leetcodeId: e.target.value})
                            }} placeholder="Enter your LeetCode ID" />
                            <button onClick={() => {
                                submitDetails("leetcode");
                            }}><i class="fa-solid fa-check"></i></button>
                        </div>
                        }
                        {!hascodeforces && <div>
                            <label htmlFor="codeforces">Codeforces ID: </label>
                            <input type="text" onChange={(e) => {
                                setUserPlatformDetails({...UserPlatformDetails, codeforcesId: e.target.value})
                            }} placeholder="Enter your Codeforces ID" />
                            <button><i class="fa-solid fa-check"></i></button>
                        </div>
                        }

                        <div className="leetcode-codeforces">
                            {hasleetcode && <LeetCodeDetails/>}
                            {hascodeforces && <CodeforcesDetails/>}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ProfileDashboard