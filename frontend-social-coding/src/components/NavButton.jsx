import "./styles/components.css"

import React from 'react'
import {useNavigate} from "react-router-dom"

const NavButton = ({content,className,location}) => {
  const navigate = useNavigate()
  return (
    <div className={className}>
        <button className="button-nav-auth" onClick={(_)=>navigate(location)}> {content} </button>
    </div>
  )
}

export default NavButton