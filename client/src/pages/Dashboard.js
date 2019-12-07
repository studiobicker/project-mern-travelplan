import React, { Component } from "react";
import TripService from "../api/tripService";
import Trip from "../components/Trip";

export default class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      myTrips: [],
      loading: true
    };
    this.tripService = new TripService();
  }

  componentDidMount = async () => {
    try {
      const myTrips = await this.tripService.getMyTrips();
      debugger;
      this.setState({ myTrips, loading: false });
    } catch (err) {
      console.log(err);
    }
  };

  renderTrips = () => {
    return this.state.myTrips.map((trip, i) => {
      return <Trip key={i} {...trip} />;
    });
  };

  render() {
    return (
      <section className="section">
        <div className="container">
          {this.state.loading && <p>Loading...</p>}
          <div className="columns">
            <div className="column">{this.renderTrips()}</div>
            <div className="column"></div>
          </div>
        </div>
      </section>
    );
  }
}
