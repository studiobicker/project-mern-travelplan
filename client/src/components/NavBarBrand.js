import React from "react";
import { Link } from "react-router-dom";
import logo from "../images/TRIPBUILDER.svg";

export default function NavBarBrand() {
  return (
    <div className="navbar-brand">
      <Link className="navbar-item" to="/">
        <img src={logo} className="logo" alt="logo" />
      </Link>
      <div className="navbar-burger burger" data-target="navbarMenu">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}
