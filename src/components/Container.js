import React from "react";
import "./Container.css";

const Container = ({ children, className = "", style = {} }) => {
  return (
    <div className={`container ${className}`} style={style}>
      {children}
    </div>
  );
};

export default Container;
