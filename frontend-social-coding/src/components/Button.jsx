import React from "react";
import "./styles/components.css";
const Button = ({className,content}) => {
  return (
    <div className={className}>
      <a class="press-button" href="#">
       {content}
      </a>
    </div>
  );
};

export default Button;
