import "./Homepage.scss";
import React from 'react';
import { Link } from "react-router-dom";
import aboutimg from "./Assets/about-img.png";
import b from "./Assets/b.jpg";
import ficon3 from "./Assets/f-icon3.png";
import k from "./Assets/k.png";
import leaderboard from "./Assets/leaderboard.png";

function Homepage() {
    return (
        <>
            <section className="home" id="home">
                <div className="content">
                    <h3>best website <span>meter</span></h3>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus suscipit porro nam libero natus error consequatur sed repudiandae eos quo?</p>
                    <Link to="/signup" className="btn">Sign Up</Link>
                </div>
                <div className="image">
                    <img src={k} alt=""/>
                </div>
            </section>
            <section className="features" id="features">
                <h1 className="heading"> website features </h1>
                <div className="box-container">
                    <div className="box">
                        <img src={b} alt=""/>
                        <h3>amazing UI design</h3>
                        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ullam minus recusandae autem, repellendus fugit quaerat provident voluptatum non officiis ratione.</p>
                    </div>
                    <div className="box">
                        <img src={leaderboard} alt=""/>
                            <h3>soft and smooth animations</h3>
                            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ullam minus recusandae autem, repellendus fugit quaerat provident voluptatum non officiis ratione.</p>
                    </div>
                    <div className="box">
                        <img src={ficon3} alt=""/>
                        <h3>freindly interactions</h3>
                        <p>
                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ullam minus recusandae autem, repellendus fugit quaerat provident voluptatum non officiis ratione.
                        </p>
                    </div>
                </div>
            </section>
            <section className="about" id="about">
                <h1 className="heading"> about the website </h1>
                <div className="column">

                    <div className="image">
                        <img src={aboutimg} alt=""/>
                    </div>
                    <div className="content">
                        <h3>Easy And Perfect Solution For Your Business website</h3>
                        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nulla placeat deserunt saepe repudiandae veniam soluta minima dolor hic aperiam iure.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laudantium, quaerat. Dolorem ratione saepe magni quo inventore porro ab voluptates eos, nam eius provident accusantium, quia similique est, repellendus et reiciendis.</p>
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