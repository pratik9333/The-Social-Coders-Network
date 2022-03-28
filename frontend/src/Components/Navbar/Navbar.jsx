import "./Navbar.scss"
import React from 'react'
import { Link } from 'react-router-dom'
import { isAuthenticated, signout } from "../../API/auth"

function Navbar() {
    let user = isAuthenticated();
    return (
        <header>
            <Link to="/" className="logo"><span>Social </span>Coding</Link>
            <input type="checkbox" id="menu-bar" />
            <label className="fas fa-bars"></label>
            <nav className="navbar">
                
                {!user && <>
                    <Link to="/">Home</Link>
                    <Link to="/signup">Signup</Link>
                    <Link to="/login">Login</Link></>}
                {user && <div className="nav-userdeatils">
                    <Link to="/">Home</Link>
                    <Link to="/profile">Profile</Link>
                    <Link to="/feeds">Feed</Link>
                    <Link to="/leaderboard">Leaderboard</Link>
                    <p style={{ marginLeft:"45px"}} className="nav-username">{user.name}</p>
                    <img style={{ marginRight:"5px"}} className="nav-userimage" src={user.photo.url} alt="" />
                    <button onClick={signout}>Logout</button>
            </div>}
            </nav>
        </header>
    )
}

export default Navbar