import React, { Component } from "react";
import queryString from "query-string";
import Loader from "../components/Loader";
import Accept from "../components/handleInvites/Accept";
import LoginAccept from "../components/handleInvites/LoginAccept";
import RegisterAccept from "../components/handleInvites/RegisterAccept";
import ErrorPage from "../pages/ErrorPage";
import TripService from "../api/tripService";

export default class AcceptInvitation extends Component {
  constructor() {
    super();
    this.state = {
      task: null,
      invitation: null,
      isLoading: true,
      user: null,
      err: null
    };
    this.tripService = new TripService();
  }

  componentDidMount = async () => {
    const task = this.props.match.params.task;
    const token = queryString.parse(this.props.location.search).token;
    let invitation;
    let error = null;
    try {
      debugger;
      invitation = await this.tripService.getInvitation(token);
      const user = this.props.user; /* check if user is loggedIn */

      if (user && user.email !== invitation.email) {
        /* check if user === invitee */
        error = `This invitation was send to ${invitation.email}. Please switch account.`;
      }

      this.setState({
        task,
        invitation,
        user: user,
        err: error,
        isLoading: false
      });
    } catch (err) {
      const { message } = err.response.data;
      this.setState({ err: message, isLoading: false });
    }
  };

  setTaskState = task => {
    this.setState({ task });
  };

  acceptInvitation = async () => {
    debugger;
    try {
      const accept = await this.tripService.acceptInvitation(
        this.state.invitation.uuid
      );
      this.props.history.push("/dashboard");
    } catch (err) {
      const { message } = err.response.data;
      this.setState({ err: message });
    }
  };

  render() {
    if (this.state.isLoading) return <Loader className="full-screen-loader" />;
    if (this.state.err) return <ErrorPage message={this.state.err} />;
    if (this.state.user) {
      return (
        <Accept
          trip={this.state.invitation.trip.name}
          acceptInvitation={this.acceptInvitation}
        />
      );
    } else {
      debugger;
      if (this.state.task === "accept") {
        return (
          <LoginAccept
            trip={this.state.invitation.trip.name}
            token={this.state.invitation.uuid}
            acceptInvitation={this.acceptInvitation}
            setTaskState={this.setTaskState}
            setUserState={this.props.setUserState}
            history={this.props.history}
          />
        );
      } else {
        return (
          <RegisterAccept
            trip={this.state.invitation.trip.name}
            token={this.state.invitation.uuid}
            acceptInvitation={this.acceptInvitation}
            setTaskState={this.setTaskState}
            setUserState={this.props.setUserState}
            history={this.props.history}
          />
        );
      }
    }
  }
}
