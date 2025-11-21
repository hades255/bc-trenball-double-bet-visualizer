import React from "react";
import "./Navbar.css";

const Navbar = ({ active, onClick }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span>{active.toUpperCase()}</span>
      </div>
      <ul className="navbar-links">
        <li>
          <button onClick={() => onClick("trenball")}>T</button>
        </li>
        <li>
          <button onClick={() => onClick("limbo")}>L</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
