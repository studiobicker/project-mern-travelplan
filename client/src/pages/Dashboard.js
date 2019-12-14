import React, { Component } from "react";
import TripService from "../api/tripService";
import Trip from "../components/Trip";
import NothingFound from "../components/NothingFound";
import Loader from "../components/Loader";

export default class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      myTrips: null,
      isLoading: true
    };
    this.tripService = new TripService();
  }

  componentDidMount = async () => {
    try {
      const myTrips = await this.tripService.getMyTrips();
      debugger;
      this.setState({ myTrips, isLoading: false });
    } catch (err) {
      console.log(err);
    }
  };

  renderTrips = () => {
    debugger;
    if (this.state.myTrips && this.state.myTrips.length > 0) {
      return this.state.myTrips.map((trip, i) => {
        return <Trip key={i} {...trip} />;
      });
    } else {
      return <NothingFound />;
    }
  };

  render() {
    if (this.state.isLoading) return <Loader className="full-screen-loader" />;
    return (
      <section className="section">
        <div className="container">
          <div className="columns">
            <div className="column is-half">{this.renderTrips()}</div>
          </div>
        </div>
      </section>
    );
  }
}
