import "./Signup.scss";
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom";
import backend from "../../backend";
import { LoadingComponent } from "../Loading/Loading";


import {
    nameHandler,
    profilePhotoHandler,
    emailHandler,
    passwordHandler,
    leetcodeHandler,
    githubHandler,
    codeforcesHandler,
    codechefHandler
}
    from "./helpers"
import axios from "axios";
import { authenticate, isAuthenticated } from "../../API/auth";
import Navbar from "../Navbar/Navbar";

function Signup() {

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [signupData, setSignUpData] = useState({
        name: "",
        email: "",
        password: "",
        github: "",
        leetcode: "",
        codeforces: "",
        codechef: "",
        profileImg: {}
    });
    let navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        let temp = {
            name: signupData.name,
            email:signupData.email,
            password: signupData.password,
            leetcode: signupData.leetcode,
            codeforces: signupData.codeforces,
            codechef: signupData.codechef,
            github:signupData.github,
        }

        let data = new FormData();
        data.append("photo", signupData.profileImg);
        data.append("name", temp.name);
        data.append("email", temp.email);
        data.append("password", temp.password);
        data.append("leetcodeId", temp.leetcode);
        data.append("codechefId", temp.codechef);
        data.append("codeforcesId", temp.password);
        data.append("githubId", temp.github);

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
            }))
            .catch((error) => {
                setLoading(false);
                setError(error.response.data.error)
            })
    }
    useEffect(() => {
        if (isAuthenticated()) {
            navigate('/');
        }
    }, []);


    return (
        <>
            <Navbar />
        <section id="signup-form-section">
            {loading ? <LoadingComponent /> :
                <form onSubmit={submitHandler}>
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
                                <input type="text" id="Email" required onChange={(e) => { emailHandler(e, setSignUpData, signupData) }} />
                            </li>
                            <li>
                                <label>Password:</label>
                                <input type="password" id="password" required onChange={(e) => { passwordHandler(e, setSignUpData, signupData) }} />
                            </li>
                            <li>
                                <label>ProfilePhoto:</label>
                                <input type="file" id="profile-photo" required accept=".png,.jpeg,.jpg" onChange={(e) => { profilePhotoHandler(e, setSignUpData, signupData) }} />
                            </li>
                            <li>
                                <label>Leetcode ID</label>
                                <input type="text" id="leetcodeID" required onChange={(e) => { leetcodeHandler(e, setSignUpData, signupData) }} />
                            </li>
                            <li>
                                <label>Codechef ID</label>
                                <input type="text" id="codechefID" required onChange={(e) => { codechefHandler(e, setSignUpData, signupData) }} />
                                </li>
                            <li>
                                <label>CodeForces ID</label>
                                <input type="text" id="codeforcesId" required onChange={(e) => { codeforcesHandler(e, setSignUpData, signupData) }} />
                            </li>
                            <li>
                                <label>GitHub ID</label>
                                <input type="text" id="githubID" required onChange={(e) => { githubHandler(e, setSignUpData, signupData) }} />
                            </li>
                        </ul>
                    </fieldset>
                    {error && <p id="error-msg">{error}</p>}
                    <button type='submit' style={{cursor: "pointer"}}>Create Account!</button>
                    <Link to="/login"><button style={{cursor: "pointer"}} type="button">Already have an Account?</button></Link>
                </form>
            }
            </section>
            
            </>
    )
}

export default Signup