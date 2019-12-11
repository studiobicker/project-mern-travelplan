import React, { Component } from "react";
import TripService from "../api/tripService";
import SideMenu from "../components/SideMenu";
import Loader from "../components/Loader";
import Member from "../components/Member";
import Invitee from "../components/Invitee";

export default class InvitePeople extends Component {
  constructor() {
    super();
    this.state = {
      trip: null,
      isLoadingTrip: true,
      err: null,
      email: ""
    };
    this.tripService = new TripService();
  }
  componentDidMount = async () => {
    const id = this.props.match.params.id;
    try {
      debugger;
      const trip = await this.tripService.getInvitations(id);
      this.setState({
        trip,
        isLoadingTrip: false
      });
    } catch (err) {
      console.log(err);
    }
  };
  listOfInvitations = () => {
    return this.state.trip.invitations.map((invitation, i) => {
      return (
        <Invitee
          key={i}
          index={i}
          invitation={invitation}
          deleteInvitation={this.deleteInvitation}
        />
      );
    });
  };
  listOfMembers = () => {
    return this.state.trip.travelers.map((member, i) => {
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

  deleteInvitation = async id => {
    const tripId = this.state.trip._id;
    debugger;
    const updatedTrip = await this.tripService.deleteInvitation(id, tripId);

    this.setState({
      trip: updatedTrip
    });
  };

  onChangeHandler = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  onSubmitHandler = async e => {
    e.preventDefault();
    debugger;
    try {
      const trip = await this.tripService.sendInvitation(
        this.state.email,
        this.state.trip._id
      );

      this.setState({
        trip,
        isLoadingTrip: false,
        email: ""
      });
    } catch (err) {
      const { message } = err.response.data;
      this.setState({ err: message });
    }
  };

  render() {
    if (this.state.isLoadingTrip)
      return <Loader className="full-screen-loader" />;
    return (
      <div className="columns is-gapless">
        <div className="column">
          <div className="column-padding">
            <SideMenu tripId={this.state.trip._id} />
          </div>
        </div>
        <div className="column is-four-fifths">
          <div className="column-padding">
            <div className="card">
              <header className="card-header">
                <h1 className="card-header-title">{this.state.trip.name}</h1>
              </header>
              <div className="card-content">
                <h2 className="subtitle">Send an invitation</h2>
                <form onSubmit={this.onSubmitHandler}>
                  <div className="field is-grouped">
                    <p className="control">
                      <input
                        className="input"
                        name="email"
                        onChange={this.onChangeHandler}
                        value={this.state.email}
                        type="email"
                        placeholder="Enter a email address"
                      />
                    </p>
                    <button className="button is-link">Send</button>
                  </div>
                </form>
                <hr />
                <h2 className="subtitle">Members</h2>
                <ul>
                  {this.listOfMembers()}
                  {this.listOfInvitations()}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
