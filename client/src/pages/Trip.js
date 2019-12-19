import React, { Component } from "react";
import TripService from "../api/tripService";
import Loader from "../components/Loader";
import WeatherService from "../api/weatherService";
import Member from "../components/Member";
import MapOnly from "../components/MapOnly";
import DestinationsOnly from "../components/DestinationsOnly";
import SendInvitation from "../components/SendInvitation";

export default class Trip extends Component {
  constructor() {
    super();
    this.state = {
      trip: null,
      level: null,
      weather: null,
      isLoadingTrip: true,
      err: null,
      msg: null,
      showModal: false
    };
    this.tripService = new TripService();
    this.weatherService = new WeatherService();
  }

  componentDidMount = async () => {
    const id = this.props.match.params.id;
    try {
      const userTrip = await this.tripService.getMyTrip(id);
      const currentWeather = await this.weatherService.getWeather(
        userTrip.trip.country.latitude,
        userTrip.trip.country.longitude
      );

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

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal });
  };

  listOfMembers = () => {
    return this.state.trip.members.map((member, i) => {
      return (
        <Member
          key={i}
          index={i}
          member={member}
          deleteMember={this.deleteMember}
        />
      );
    });
  };

  sendInvitation = async invitation => {
    //the invitation parameter is the state of Modal
    try {
      const id = this.props.match.params.id;
      const invitationSend = await this.tripService.sendInvitation(
        invitation,
        id
      );

      this.setState({
        showModal: false,
        msg: invitationSend.message
      });
    } catch (err) {
      const { message } = err.response.data;
      this.setState({ err: message, showModal: false });
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
                <div className="tile is-parent">
                  <article className="tile is-child box">
                    <div className="content">
                      <h3 className="subtitle">Members</h3>
                    </div>
                    <div className="member">
                      <ul className="memberList">{this.listOfMembers()}</ul>
                      <br />
                      {this.state.level.levelnum <= 5 && (
                        <button
                          className="button is-link is-fullwidth"
                          onClick={this.toggleModal}
                        >
                          <span className="icon">
                            <i className="fas fa-plus"></i>
                          </span>
                          <span>Invite people</span>
                        </button>
                      )}
                    </div>
                    {this.state.showModal && (
                      <SendInvitation
                        toggleModal={this.toggleModal}
                        sendInvitation={this.sendInvitation}
                      />
                    )}
                    {this.state.err && (
                      <article class="message is-error">
                        <div class="message-body">{this.state.err}</div>
                      </article>
                    )}
                    {this.state.msg && (
                      <article class="message is-success">
                        <div class="message-body">{this.state.msg}</div>
                      </article>
                    )}
                  </article>
                </div>
                <div className="tile is-parent">
                  <MapOnly
                    trip={this.state.trip}
                    level={this.state.level}
                    mode="readOnly"
                  />
                </div>
              </div>
            </div>

            <div className="tile is-parent">
              <article className="tile is-child notification is-primary">
                <div className="content">
                  <h3 className="subtitle">Destinations</h3>
                </div>
                <DestinationsOnly trip={this.state.trip} readMode={true} />
              </article>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
