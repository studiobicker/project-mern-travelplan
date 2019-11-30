import React from "react";
import { Link } from "react-router-dom";
import NavBarBrand from "./NavBarBrand";

export default function NavBar({ user, logout }) {
  if (user) {
    return (
      <nav className="navbar is-shadowed is-spaced">
        <NavBarBrand />
        <div id="navbarMenu" className="navbar-menu">
          <div className="navbar-start">
            <Link className="navbar-item" to="/dashboard">
              Dashboard
            </Link>
            <Link className="navbar-item" to="/add-trip">
              Add Trip
            </Link>
          </div>
          <div className="navbar-end">
            <div className="navbar-item has-dropdown is-hoverable">
              <Link className="button is-light" to="/profile">
                <span className="icon">
                  <i className="fas fa-user"></i>
                </span>
                <span>Account</span>
              </Link>
              <div className="navbar-dropdown is-boxed">
                <Link className="navbar-item" to="/profile">
                  Profile
                </Link>
                <Link className="navbar-item" onClick={logout} to="/">
                  Sign out
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  } else {
    return (
      <nav className="navbar is-transparent is-spaced">
        <NavBarBrand />
        <div id="navbarMenu" className="navbar-menu">
          <div className="navbar-start">
            <Link className="navbar-item" to="/how-it-works">
              How it works
            </Link>
          </div>
          <div className="navbar-end">
            <div className="navbar-item">
              <div className="buttons">
                <Link className="button is-primary" to="/register">
                  <strong>Sign up</strong>
                </Link>
                <Link className="button is-light" to="/login">
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}
