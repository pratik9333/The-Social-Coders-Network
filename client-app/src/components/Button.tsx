import { type } from "os";
import React from "react";
import "./styles/components.css";
import { LandingButtonProps } from "../@types/ComponentTypes"


const Button:React.FC< LandingButtonProps > = ({className,content}) => {
  return (
    <div className={className}>
      <a className="press-button" href="#">
         {content}
      </a>
    </div>
  );
};

export default Button;
