import "./Login.scss"
import React, { useState, useRef } from 'react'
import { Link } from "react-router-dom";
import axios from "axios";

function Login({setUser}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const [error, setError] = useState("");

    const emailHandler = (e) => {
        setEmail(e.target.value);
    }

    const passwordHandler = (e) => {
        setPassword(e.target.value);
    }

    const submitHandler = (e) => {
        e.preventDefault();
        if (email === "") {
            emailRef.current.focus();
            setError("Email Field is Required!");
            return
        }
        if(password === ""){
            passwordRef.current.focus();
            setError("Password Field is Required!");
            return
        }
        if(email!=="" || password!==""){
            if(!email.includes("@") && !email.includes(".")){
                setError("Enter Valid Email ID!");
                emailRef.current.focus();
                return;
            }
            if(password.length<6){
                setError("Password must be 6 Digit Long!");
                passwordRef.current.focus();
                return;
            }
        }

        const credentials = {
            email,
            password
        }
        
        axios.post("http://localhost:4000/api/v1/signin",credentials)
            .then((res)=>{
                console.log(res)
                setUser(res.data.user)
                localStorage.setItem("token",res.data.token);
            })
            .catch(async (err)=>{
                const data = await err.json();
                console.log(data);
            })
    }

    return (
        <section id="login-form-section">
            <form>
                <h2>Login!</h2>
                <fieldset>
                    <legend>Login</legend>
                    <ul>
                        <li>
                            <label>Email:</label>
                            <input ref={emailRef} type="text" id="Email" required onChange={emailHandler} />
                        </li>
                        <li>
                            <label>Password:</label>
                            <input ref={passwordRef} type="password" id="password" required onChange={passwordHandler} />
                        </li>
                    </ul>
                </fieldset>
                {error && <p id="error-msg">{error}</p>}
                <button type='submit' onClick={submitHandler}>Login</button>
                <Link to="/signup"><button type="button">Don't have an Account?</button></Link>
            </form>
        </section>
    )
}

export default Login