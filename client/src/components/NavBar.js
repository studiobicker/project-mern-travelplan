import React, { Component } from "react";
import { Link } from "react-router-dom";
import NavbarBurger from "./NavBarBurger";
import logo from "../images/TRIPBUILDER.svg";

export default class NavBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeMenu: false
    };
  }

  toggleMenu = () => {
    this.setState({
      activeMenu: !this.state.activeMenu
    });
  };

  closeMenu = () => {
    this.setState({
      activeMenu: false
    });
  };

  logoutAndCloseMenu = () => {
    this.props.logout();
    this.toggleMenu();
  };

  render() {
    if (this.props.user) {
      return (
        <nav className="navbar has-shadow is-spaced">
          <div className="container">
            <div className="navbar-brand">
              <Link className="navbar-item" to="/">
                <img src={logo} className="logo" alt="logo" />
              </Link>
              <NavbarBurger
                active={this.state.activeMenu}
                toggleMenu={this.toggleMenu}
              />
            </div>

            <div
              id="navbarMenu"
              className={`navbar-menu ${
                this.state.activeMenu ? "is-active" : ""
              }`}
            >
              <div className="navbar-start">
                <Link
                  className="navbar-item"
                  to="/dashboard"
                  onClick={this.closeMenu}
                >
                  Dashboard
                </Link>
                <Link
                  className="navbar-item"
                  to="/add-trip"
                  onClick={this.closeMenu}
                >
                  Add Trip
                </Link>
              </div>
              <div className="navbar-end">
                <div className="navbar-item has-dropdown is-hoverable">
                  <Link
                    className="navbar-link"
                    to="/profile"
                    onClick={this.closeMenu}
                  >
                    My Account
                  </Link>
                  <div className="navbar-dropdown">
                    <div className="navbar-item account">
                      <p>
                        <strong>{this.props.user.name}</strong>
                      </p>
                      <p className="small">{this.props.user.email}</p>
                    </div>
                    <hr className="navbar-divider" />
                    <Link
                      className="navbar-item"
                      to="/profile"
                      onClick={this.closeMenu}
                    >
                      Settings
                    </Link>
                    <Link
                      className="navbar-item"
                      onClick={this.logoutAndCloseMenu}
                      to="/"
                    >
                      Sign out
                    </Link>
                  </div>
                </div>
                <Link
                  className="navbar-item"
                  to="/notifications"
                  onClick={this.closeMenu}
                >
                  <span className="icon">
                    <i className="fas fa-bell"></i>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </nav>
      );
    } else {
      return (
        <nav className="navbar is-transparent is-spaced">
          <div className="container">
            <div className="navbar-brand">
              <Link className="navbar-item" to="/">
                <img src={logo} className="logo" alt="logo" />
              </Link>
              <NavbarBurger
                active={this.state.activeMenu}
                toggleMenu={this.toggleMenu}
              />
            </div>
            <div
              id="navbarMenu"
              className={`navbar-menu ${
                this.state.activeMenu ? "is-active" : ""
              }`}
            >
              <div className="navbar-start">
                <Link
                  className="navbar-item"
                  to="/how-it-works"
                  onClick={this.closeMenu}
                >
                  How it works
                </Link>
              </div>
              <div className="navbar-end">
                <div className="navbar-item">
                  <div className="buttons">
                    <Link
                      className="button is-primary"
                      to="/register"
                      onClick={this.closeMenu}
                    >
                      <strong>Sign up</strong>
                    </Link>
                    <Link
                      className="button is-light"
                      to="/login"
                      onClick={this.closeMenu}
                    >
                      Log in
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      );
    }
  }
}
