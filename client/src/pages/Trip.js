import React, { Component } from "react";
import TripService from "../api/tripService";
import Loader from "../components/Loader";
import WeatherService from "../api/weatherService";

export default class Trip extends Component {
  constructor() {
    super();
    this.state = {
      trip: null,
      level: null,
      weather: null,
      isLoadingTrip: true,
      err: null
    };
    this.tripService = new TripService();
    this.weatherService = new WeatherService();
  }

  componentDidMount = async () => {
    const id = this.props.match.params.id;
    try {
      debugger;
      const userTrip = await this.tripService.getTripById(id);
      const currentWeather = await this.weatherService.getWeather(
        userTrip.trip.country.latitude,
        userTrip.trip.country.longitude
      );

      debugger;
      this.setState({
        trip: userTrip.trip,
        level: userTrip.level,
        weather: currentWeather,
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
          <div className="tile is-ancestor">
            <div className="tile is-vertical is-8">
              <div className="tile is-parent">
                <article className="tile is-child content notification is-link">
                  <h2 className="title">{this.state.trip.name}</h2>
                  <div className="tile-menu">
                    <i className="fas fa-ellipsis-v"></i>
                  </div>
                  <div className="subtitle">{this.state.trip.country.name}</div>
                  <p>{this.state.trip.description}</p>
                  <div className="currentWeather">
                    <div
                      className={`weatherIcon i-${this.state.weather.weather[0].icon}`}
                    ></div>
                    <div className="temp">
                      {this.state.weather.main.temp}&deg;
                    </div>
                    <div className="desc">
                      {this.state.weather.weather[0].description}
                    </div>
                  </div>
                </article>
              </div>
              <div className="tile">
                <div className="tile is-parent is-vertical">
                  <article className="tile is-child box"></article>
                  <article className="tile is-child box"></article>
                </div>
                <div className="tile is-parent">
                  <article className="tile is-child box"></article>
                </div>
              </div>
            </div>
            <div className="tile is-parent">
              <article className="tile is-child content box">
                <h3 className="subtitle">Members</h3>
              </article>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
