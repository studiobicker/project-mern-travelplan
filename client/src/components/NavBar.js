import React, { Component } from "react";
import { Link } from "react-router-dom";
import NavbarBurger from "./NavBarBurger";
import NavBarTrips from "./NavBarTrips";
import logo from "../images/tripbuilder.svg";

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
        <nav className="navbar is-spaced">
          <div className="navbar-brand">
            <Link className="navbar-item" to="/dashboard">
              <img src={logo} className="logo" alt="logo" />
            </Link>
            <NavBarTrips
              user={this.props.user}
              setUserState={this.props.setUserState}
            />

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
            {this.props.user.currentTrip && (
              <div className="navbar-start">
                <Link
                  className="navbar-item"
                  to={`/tripmembers/${this.props.user.currentTrip.trip._id}`}
                  onClick={this.closeMenu}
                >
                  <span className="icon">
                    <i className="far fa-compass"></i>
                  </span>
                  <span>Explore</span>
                </Link>
                <Link
                  className="navbar-item"
                  to={`/tripmembers/${this.props.user.currentTrip.trip._id}`}
                  onClick={this.closeMenu}
                >
                  <span className="icon">
                    <i className="far fa-bookmark"></i>
                  </span>
                  <span>Saved</span>
                </Link>

                <Link
                  className="navbar-item"
                  to={`/travelplan/${this.props.user.currentTrip.trip._id}`}
                  onClick={this.closeMenu}
                >
                  <span className="icon">
                    <i className="fas fa-route"></i>
                  </span>
                  <span>Travel route</span>
                </Link>

                <Link
                  className="navbar-item"
                  to={`/messages/${this.props.user.currentTrip.trip._id}`}
                  onClick={this.closeMenu}
                >
                  <span className="icon">
                    <i className="far fa-comments"></i>
                  </span>
                  <span>Chat</span>
                </Link>
              </div>
            )}
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
                    Log out
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
        </nav>
      );
    } else {
      return (
        <nav className="navbar is-spaced">
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
        </nav>
      );
    }
  }
}
