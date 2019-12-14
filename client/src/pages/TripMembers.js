import React, { Component } from "react";
import TripService from "../api/tripService";
import SideMenu from "../components/SideMenu";
import Loader from "../components/Loader";
import Member from "../components/Member";
import SendInvitation from "../components/SendInvitation";

export default class TripMembers extends Component {
  constructor() {
    super();
    this.state = {
      trip: null,
      level: null,
      isLoadingTrip: true,
      err: null,
      msg: null,
      showModal: false
    };
    this.tripService = new TripService();
  }
  componentDidMount = async () => {
    const id = this.props.match.params.id;
    try {
      const userTrip = await this.tripService.getTripMembers(id);
      this.setState({
        trip: userTrip.trip,
        level: userTrip.level,
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
      <div className="container">
        <div className="db-duo">
          <aside className="db-side">
            <SideMenu tripId={this.state.trip._id} />
          </aside>

          <div className="db-lead">
            <div className="card">
              <div className="card-content">
                <h2 className="subtitle">Members</h2>
                <ul className="memberList">
                  {this.listOfMembers()}
                  {this.state.level.levelnum <= 5 && (
                    <li>
                      <button
                        onClick={this.toggleModal}
                        className="button is-medium is-light is-round"
                      >
                        <span className="icon">
                          <i className="fas fa-plus"></i>
                        </span>
                      </button>
                    </li>
                  )}
                </ul>
                {this.state.showModal && (
                  <SendInvitation
                    toggleModal={this.toggleModal}
                    sendInvitation={this.sendInvitation}
                  />
                )}
              </div>

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
            </div>
          </div>
        </div>
      </div>
    );
  }
}
