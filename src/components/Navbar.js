import React from "react";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <a href="/">BC</a>
      </div>
      <ul className="navbar-links">
        <li>
          <a href="/trenball">Trenball</a>
        </li>
        <li>
          <a href="/limbo">Limbo</a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
