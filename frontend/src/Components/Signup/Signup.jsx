import "./Signup.scss"
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom";
import backend from "../../backend"


import {
    nameHandler,
    profilePhotoHandler,
     emailHandler, passwordHandler
}
    from "./helpers"
import axios from "axios";
import { authenticate, isAuthenticated } from "../../API/auth";

function Signup() {
   
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [signupData, setSignUpData] = useState({ name: "", profileImg: {} });
    let navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        let temp = {
            name: signupData.name,
            email,
            password,
        }

        let data = new FormData();
        data.append("photo", signupData.profileImg);
        data.append("name", temp.name);
        data.append("email", temp.email);
        data.append("password", temp.password);

        axios.post(`${backend}/signup`,data)
            .then((res => {
                console.log(res.data.user);
                setError("")
                authenticate(res.data.user,res.data.token, () => {
                    setEmail("");
                    setPassword("");
                });
                setLoading(false);
                navigate('/');
                window.location.reload(true);
            }))
            .catch((error) => {
                setLoading(false);
                console.log(error.response.data.error);
                setError(error.response.data.error)
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
    useEffect(() => {
        if (isAuthenticated()) {
            navigate('/');
        }
    }, []);

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
                        </ul>
                    </fieldset>
                    {error && <p id="error-msg">{error}</p>}
                    <button type='submit' style={{cursor: "pointer"}} onClick={submitHandler}>Create Account!</button>
                    <Link to="/login"><button style={{cursor: "pointer"}} type="button">Already have an Account?</button></Link>
                </form>
            }
        </section>
    )
}

export default Signup