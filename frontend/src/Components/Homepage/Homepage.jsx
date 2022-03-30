import "./Homepage.scss";
import React from 'react';
import { Link } from "react-router-dom";
import aboutimg from "./Assets/about-img.png";
import b from "./Assets/b.jpg";
import ficon3 from "./Assets/f-icon3.png";
import coding from "./Assets/coding.jpg";
import leaderboard from "./Assets/leaderboard.png";
import { isAuthenticated } from "../../API/auth";
import Navbar from "../Navbar/Navbar";

function Homepage() {
    let user = isAuthenticated()
    return (
        <>
            <Navbar />
            <section className="home" id="home">
                <div className="content">
                    <h3>Social Coding</h3>
                    <p className="lead">The largest and most advanced development platform in the world.</p>
                    <p>It lets you and others to calculate your acutal rating incuding  projects, competitive programming and other professional growth.</p>
                    {!user ? <Link to="/signup" className="btn">Sign Up</Link> : <Link to="/feeds" className="btn">Feeds</Link> }
                </div>
                <div className="image">
                    <img src={coding} alt=""/>
                </div>
            </section>
            <section className="features" id="features">
                <h1 className="heading"> website features </h1>
                <div className="box-container">
                    <div className="box">
                        <img src={b} alt=""/>
                        <h3>All In One Place</h3>
                        <p className="lead" style={{textAlign: "justify", fontSize: "15px"}}>Your professionally designed site will work on Desktop, Laptop, Tablet & Mobile. Let our site focus on making your work easy, so you can focus on building your amazing profile. Once your profile is ready, updating your profile, editing it  online could be easier on the platform! Make updates anytime, anywhere, with the easiest online meter on the planet.</p>
                    </div>
                    <div className="box">
                        <img src={leaderboard} alt=""/>
                            <h3>Amazing UI</h3>
                            <p className="lead" style={{textAlign: "justify", fontSize: "15px"}}>All in one websites builds your profile on the Innovators platform. <br /> Innovators is the most intuitive and easy to use website meter on the market. <br />  Managing your profile with Innovators is super easy, with support available 24/7! <br /> Let Innovators help you know your true position in market all over the world.</p>
                    </div>
                    <div className="box">
                        <img src={ficon3} alt=""/>
                        <h3>freindly interactions</h3>
                        <p className="lead" style={{textAlign: "justify", fontSize: "15px"}}>
                            In 3 super simple steps, our professional website will have your profile up and running. You can easily edit the profile anytime you like on the super easy Innovators website editor, with expert help always available 24/7.
                            <br />
                            <span style={{ fontWeight: "bold" }}>
                                1. Sign Up
                                <br />
                                2. Login
                                <br />
                                3. You're Live!
                            </span>
                        </p>
                    </div>
                </div>
            </section>
            <section className="about" id="about">
                <h1 className="heading"> About our app </h1>
                <div className="column">

                    <div className="image">
                        <img src={aboutimg} alt=""/>
                    </div>
                    <div className="content">
                        <h3 style={{fontSize: "20px"}}>This website helps coders all over the world to get exposure of different coding profiles of people and able to rank it by their experience.</h3>
                    </div>
                </div>
            </section>
            <div className="footer">
                <h1 className="credit"> &copy; copyright @ Hackathon 2022 by innovators </h1>
            </div>
        </>
    )
}

export default Homepage