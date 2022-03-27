import "./Signup.scss"
import React, { useState } from 'react'
import { Link } from "react-router-dom";
import {
    nameHandler,
    profilePhotoHandler,
    leetcodeHandler,
    codeforcesHandler,
    githubHandler, emailHandler, passwordHandler, formvalidate
}
    from "./helpers"
import axios from "axios";

function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoding] = useState(false);
    const [message, setMessage] = useState("");
    const [signupData, setSignUpData] = useState({ name: "", profileImg: {}, leetCode: "", codeforces: "", github: "" });

    const submitHandler = async (e) => {
        e.preventDefault();
        if(!formvalidate( email, password, signupData, setError )){
            return;
        }
        setLoding(true);
        let temp = JSON.stringify({
            name: signupData.name,
            email,
            password,
        })

        let data = new FormData();
        data.append("photo", signupData.profileImg);
        data.append("userDetails", temp)

        axios.post("http://localhost:4000/api/v1/signup", data)
            .then((res => {
                console.log(res.data);
                setError("")
                setMessage("Sucessfull, Now Login");
                setLoding(false);
            }))
            .catch((err) => {
                console.log(err);
                setMessage("");
                setError("Something Went Wrong!")
                setLoding(false);
            })
    }

    const LoadingComponent = () => {
        return (
            <div id="loading-wrapper">
                <div id="loading-text">LOADING</div>
                <div id="loading-content"></div>
            </div>
        )
    }

    return (
        <section id="signup-form-section">
            {loading ? <LoadingComponent /> :
                <form>
                    <h2>Signup!</h2>
                    <fieldset>
                        <legend>Signup</legend>
                        <ul>
                            <li>
                                <label>Full Name:</label>
                                <input type="text" id="Name" required onChange={(e) => { nameHandler(e, setSignUpData, signupData) }} />
                            </li>
                            <li>
                                <label>Email:</label>
                                <input type="text" id="Email" required onChange={(e) => { emailHandler(e, setEmail) }} />
                            </li>
                            <li>
                                <label>Password:</label>
                                <input type="password" id="password" required onChange={(e) => { passwordHandler(e, setPassword) }} />
                            </li>
                            <li>
                                <label>ProfilePhoto:</label>
                                <input type="file" id="profile-photo" required accept=".png,.jpeg,.jpg" onChange={(e) => { profilePhotoHandler(e, setSignUpData, signupData) }} />
                            </li>
                            <li>
                                <label>LeetCode:</label>
                                <input type="text" id="leetcodeprofile" required placeholder="LeetCode URL" onChange={(e) => { leetcodeHandler(e, setSignUpData, signupData) }} />
                            </li>
                            <li>
                                <label>CodeForces:</label>
                                <input type="text" id="codeforcesprofile" required placeholder="Codeforces URL" onChange={(e) => { codeforcesHandler(e, setSignUpData, signupData) }} />
                            </li>
                            <li>
                                <label>Github:</label>
                                <input type="text" id="github" required placeholder="Github URL" onChange={(e) => { githubHandler(e, setSignUpData, signupData) }} />
                            </li>
                        </ul>
                    </fieldset>
                    {error && <p id="error-msg">{error}</p>}
                    {message && <p id="sucess-msg">{message}</p>}
                    <button type='submit' onClick={submitHandler}>Create Account!</button>
                    <Link to="/login"><button type="button">Already have an Account?</button></Link>
                </form>
            }
        </section>
    )
}

export default Signup