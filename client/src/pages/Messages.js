import React, { Component } from "react";
import TripService from "../api/tripService";
import Member from "../components/Member";
import Message from "../components/Message";
import Loader from "../components/Loader";

export default class Messages extends Component {
  constructor() {
    super();

    this.state = {
      trip: null,
      level: null,
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
      const userTrip = await this.tripService.getMyTrip(id);
      debugger;
      this.setState({
        trip: userTrip.trip,
        userLevel: userTrip.level,
        isLoadingTrip: false
      });
    } catch (err) {
      console.log(err);
    }
  };

  listOfMembers = () => {
    return this.state.trip.members.map((member, i) => {
      return <Member key={i} index={i} member={member} />;
    });
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
      debugger;
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
    debugger;
    if (this.state.isLoadingTrip)
      return <Loader className="full-screen-loader" />;
    return (
      <section className="section">
        <div className="container">
          <div className="columns">
            <div className="column is-one-third">
              <div className="box">
                <div className="content">
                  <h3 className="subtitle">Members</h3>
                </div>
                <div className="member">
                  <ul className="memberList">{this.listOfMembers()}</ul>
                </div>
              </div>
            </div>
            <div className="column">
              <div className="box chatroom">
                <div className="content">
                  <h3 className="subtitle">Messages</h3>
                </div>

                <div className="messages">{this.listOfMessages()}</div>
                <form onSubmit={this.onSubmitHandler}>
                  <div className="field is-grouped">
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
                      <button className="button is-link">
                        <span className="icon is-small">
                          <i className="fas fa-paper-plane"></i>
                        </span>
                        <span>Submit</span>
                      </button>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
