import React, { Component } from "react";
import TripService from "../api/tripService";
import Loader from "../components/Loader";

export default class Trip extends Component {
  constructor() {
    super();
    this.state = {
      trip: null,
      isLoadingTrip: false,
      err: null
    };
    this.tripService = new TripService();
  }

  componentDidMount = async () => {
    const id = this.props.match.params.id;
    try {
      const userTrip = await this.tripService.getTripById(id);
      this.setState({
        trip: userTrip.trip,
        level: userTrip.level,
        isLoadingTrip: false
      });
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    if (this.state.isLoadingTrip)
      return <Loader className="full-screen-loader" />;
    return (
      <section className="section">
        <div className="container">
          <div className="columns">
            <div className="column">1</div>
            <div className="column">2</div>
          </div>
        </div>
      </section>
    );
  }
}
