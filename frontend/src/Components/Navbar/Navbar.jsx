import "./Navbar.scss"
import React from 'react'
import { Link } from 'react-router-dom'

function Navbar({user, setUser}) {
    
    const UserDetails = () => {
        return (
            <div className="nav-userdeatils">
                <p className="nav-username">{user.name}</p>
                <img className="nav-userimage" src={user.photo.url} alt="" />
                <button onClick={()=>{setUser(false)}}>Logout</button>
            </div>
        )
    }

    return (
        <header>
            <Link to="/" className="logo"><span>Inn</span>ovator</Link>
            <input type="checkbox" id="menu-bar" />
            <label for="menu-bar" className="fas fa-bars"></label>
            <nav className="navbar">
                {!user && <><Link to="/">Home</Link>
                    <Link to="/signup">Signup</Link>
                    <Link to="/login">Login</Link></>}
                {user && <UserDetails/>}
            </nav>
        </header>
    )
}

export default Navbar