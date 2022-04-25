import React from 'react';
import "./Loading.scss";


export function LoadingComponent() {
        return (
          <div id="loading-wrapper">
                <div id="loading-text" style={{color: "black"}}>LOADING</div>
                <div id="loading-content"></div>
          </div>
        )
  }