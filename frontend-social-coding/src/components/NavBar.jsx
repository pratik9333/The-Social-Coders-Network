import React from "react";
import "./styles/components.css"
import { NavButton } from ".";

const NavBar = () => {
  return (
    <div className="w-[100%] h-[100px] relative bg-slate-800">
  
      <div className="flex flex-row absolute right-0 items-center justify-center h-full gap-3">
         <NavButton content={"Login"} className ="h-[60px] "  location ="/Login"/>
         <NavButton content={"Signup"} className ="h-[60px] mr-[10px]" location="/Signup"/>
      </div>
    </div>
  );
};

export default NavBar;
