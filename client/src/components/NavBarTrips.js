import React, { Component } from "react";
import TripService from "../api/tripService";
import { Link } from "react-router-dom";

export default class NavBarTrips extends Component {
  constructor() {
    super();

    this.tripService = new TripService();
  }

  renderTrips = () => {
    const myTrips = this.props.user.memberships;
    if (myTrips && myTrips.length > 0) {
      return myTrips.map((trip, i) => {
        return (
          <div
            key={i}
            className="navbar-item"
            onClick={() => this.selectTrip(trip.trip._id)}
          >
            {trip.trip.name}
          </div>
        );
      });
    } else {
      return (
        <div className="navbar-item">
          <p>No trips found</p>
        </div>
      );
    }
  };

  selectTrip = async id => {
    try {
      const updatedUser = await this.tripService.setCurrentTrip(id);
      this.props.setUserState(updatedUser);
      debugger;
      this.props.history.push(`/trip/${updatedUser.currentTrip.trip._id}`);
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    if (this.props.user.currentTrip) {
      return (
        <div className="navbar-item has-dropdown is-hoverable">
          <Link
            className="navbar-link"
            to={`/trip/${this.props.user.currentTrip.trip._id}`}
          >
            {this.props.user.currentTrip.trip.name}
          </Link>
          <div className="navbar-dropdown">
            {this.renderTrips()}
            <hr className="navbar-divider" />

            <Link className="navbar-item" to="/add-trip">
              Add Trip
            </Link>
          </div>
        </div>
      );
    } else {
      return (
        <div className="navbar-item has-dropdown is-hoverable">
          <Link className="navbar-link" to="/profile">
            Select a trip
          </Link>
          <div className="navbar-dropdown">
            {this.renderTrips()}
            <hr className="navbar-divider" />

            <Link className="navbar-item" to="/add-trip">
              Add Trip
            </Link>
          </div>
        </div>
      );
    }
  }
}
