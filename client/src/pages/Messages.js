import React, { Component } from "react";
import TripService from "../api/tripService";
import SideMenu from "../components/SideMenu";

import Message from "../components/Message";
import Loader from "../components/Loader";

export default class Messages extends Component {
  constructor() {
    super();

    this.state = {
      trip: null,
      isLoadingTrip: true,
      err: null,
      messages: null,
      msg: ""
    };

    this.tripService = new TripService();
  }

  componentDidMount = async () => {
    const id = this.props.match.params.id;
    debugger;
    try {
      const userTrip = await this.tripService.getTripMessages(id);

      this.setState({
        trip: userTrip.trip,
        userLevel: userTrip.level,
        isLoadingTrip: false
      });
    } catch (err) {
      console.log(err);
    }
  };

  listOfMessages = () => {
    return this.state.trip.messageboard.map((message, i) => {
      return <Message key={i} message={message} user={this.props.user} />;
    });
  };

  addMessage = async msg => {
    try {
      const tripId = this.state.trip._id;
      debugger;
      const newMessage = await this.tripService.addMessage(msg, tripId);
      this.setState({
        trip: {
          ...this.state.trip,
          messageboard: this.state.trip.messageboard.concat(newMessage)
        },
        msg: ""
      });
    } catch (err) {
      const { message } = err.response.data;
      this.setState({ err: message });
    }
  };

  deleteMessage = async id => {
    const tripId = this.state.trip._id;
    const deleteMessage = await this.tripService.deleteMessage(id, tripId);

    // this.setState({
    //   trip: {
    //     ...this.state.trip,
    //     destinations: this.state.trip.destinations.filter(
    //       dest => dest._id !== id
    //     )
    //   }
    // });
  };

  onChangeHandler = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  onSubmitHandler = async e => {
    e.preventDefault();
    this.addMessage(this.state.msg);
  };

  render() {
    if (this.state.isLoadingTrip)
      return <Loader className="full-screen-loader" />;
    return (
      <div className="container">
        <div className="db-duo">
          <aside className="db-side">
            <SideMenu tripId={this.state.trip._id} />
          </aside>

          <div className="db-lead">
            <div className="card messageboard">
              <div className="card-content">
                <h2 className="subtitle">Messages</h2>

                <div className="messages">
                  <ul>{this.listOfMessages()}</ul>
                </div>
                <form onSubmit={this.onSubmitHandler}>
                  <div class="field is-grouped">
                    <p className="control is-expanded">
                      <input
                        className="input"
                        type="text"
                        name="msg"
                        placeholder="Write a message"
                        value={this.state.msg}
                        onChange={this.onChangeHandler}
                      />
                    </p>
                    <p className="control">
                      <button className="button is-link">Submit</button>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
