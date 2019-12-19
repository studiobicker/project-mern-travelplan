import React, { Component } from "react";
import TripService from "../api/tripService";
import Trip from "../components/Trip";
import NotFound from "../components/NotFound";
import Loader from "../components/Loader";
import NewTrip from "../components/NewTrip";

export default class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      myTrips: null,
      isLoading: true,
      err: null,
      msg: null,
      showModal: false
    };
    this.tripService = new TripService();
  }

  componentDidMount = async () => {
    try {
      const myTrips = await this.tripService.getMyTrips();
      this.setState({ myTrips, isLoading: false });
      debugger;
    } catch (err) {
      console.log(err);
    }
  };

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal });
  };

  onClickTripHandler = async id => {
    const updatedUser = await this.tripService.setCurrentTrip(id);
    this.props.setUserState(updatedUser);
    this.props.history.push(`/trip/${updatedUser.currentTripId}`);
  };

  renderTrips = () => {
    debugger;
    if (this.state.myTrips && this.state.myTrips.length > 0) {
      return this.state.myTrips.map((trip, i) => {
        return (
          <Trip
            key={i}
            {...trip}
            onClickTripHandler={this.onClickTripHandler}
          />
        );
      });
    } else {
      return <NotFound />;
    }
  };

  addTrip = async trip => {
    //the invitation parameter is the state of Modal
    debugger;
    try {
      const newTrip = await this.tripService.create(trip);

      this.setState({
        myTrips: {
          ...this.state.myTrips,
          trips: this.state.myTrip.concat(newTrip)
        },
        showModal: false
      });
    } catch (err) {
      const { message } = err.response.data;
      this.setState({ err: message, showModal: false });
    }
  };

  render() {
    if (this.state.isLoading) return <Loader className="full-screen-loader" />;
    return (
      <section className="section">
        <nav class="level">
          <div className="container">
            <div class="level-left">
              <div class="level-item">
                <p class="subtitle is-5">
                  <strong>All</strong> trips{" "}
                  <span className="icon">
                    <i className="fas fa-chevron-right"></i>
                  </span>
                </p>
              </div>
              <div class="level-item">
                <button class="button is-primary" onClick={this.toggleModal}>
                  Add a new trip
                </button>
              </div>
            </div>
          </div>
        </nav>
        <div className="container">
          <div className="columns is-multiline">{this.renderTrips()}</div>
        </div>
        {this.state.showModal && (
          <NewTrip toggleModal={this.toggleModal} addTrip={this.addTrip} />
        )}
        {this.state.err && (
          <article class="message is-error">
            <div class="message-body">{this.state.err}</div>
          </article>
        )}
      </section>
    );
  }
}
