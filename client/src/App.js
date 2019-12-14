import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import NewTrip from "./pages/NewTrip";
import TravelPlan from "./pages/TravelPlan";
import TripMembers from "./pages/TripMembers";
import AcceptInvitation from "./pages/AcceptInvitation";
import Messages from "./pages/Messages";
import PrivateRoute from "./components/PrivateRoute";
import Loader from "./components/Loader";
import AuthService from "./api/authService";
import NavBar from "./components/NavBar";

import "./App.css";

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      isLoadingUser: true
    };
    this.authService = new AuthService();
  }

  componentDidMount = async () => {
    debugger;
    let user;
    try {
      user = await this.authService.isLoggedIn();
    } catch (err) {
      user = null;
    } finally {
      this.setUserState(user);
    }
  };

  setUserState = user => {
    this.setState({ user, isLoadingUser: false });
  };

  logout = async () => {
    let user;
    try {
      user = await this.authService.logout();
    } catch (err) {
      console.log(err);
    } finally {
      this.setState({ user: null });
    }
  };
  render() {
    if (this.state.isLoadingUser)
      return <Loader className="full-screen-loader" />;

    return (
      <div className="App">
        <NavBar user={this.state.user} logout={this.logout} />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route
            path="/login"
            render={props => (
              <Login {...props} setUserState={this.setUserState} />
            )}
          />
          <Route
            path="/register"
            render={props => (
              <Register {...props} setUserState={this.setUserState} />
            )}
          />
          <PrivateRoute
            path="/dashboard"
            user={this.state.user}
            component={Dashboard}
          />
          <PrivateRoute
            path="/profile"
            user={this.state.user}
            setUserState={this.setUserState}
            component={Profile}
          />
          <PrivateRoute
            path="/add-trip"
            user={this.state.user}
            component={NewTrip}
          />
          <Route
            path="/travelplan/:id"
            user={this.state.user}
            component={TravelPlan}
          />
          <Route
            path="/tripmembers/:id"
            user={this.state.user}
            component={TripMembers}
          />
          <Route
            path="/invite/:task"
            render={props => (
              <AcceptInvitation
                {...props}
                user={this.state.user}
                setUserState={this.setUserState}
              />
            )}
          />
          <Route
            path="/messages/:id"
            user={this.state.user}
            component={Messages}
          />
        </Switch>
      </div>
    );
  }
}
