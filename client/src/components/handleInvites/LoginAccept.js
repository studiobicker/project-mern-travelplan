import React, { Component } from "react";
import { Link } from "react-router-dom";
import LoginForm from "../LoginForm";
import AuthService from "../../api/authService";

export default class LoginAccept extends Component {
  constructor() {
    super();
    this.state = {
      err: null,
      email: "",
      password: ""
    };
    this.authService = new AuthService();
  }

  onChangeHandler = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  onSubmitHandler = async e => {
    e.preventDefault();
    debugger;
    try {
      const user = await this.authService.login({
        email: this.state.email,
        password: this.state.password
      });
      // accept invitation
      this.props.acceptInvitation();
      debugger;
      this.props.setUserState(user);
      debugger;
      this.props.history.push("/dashboard");
      debugger;
    } catch (err) {
      const { message } = err.response.data;
      this.setState({ err: message });
    }
  };

  render() {
    return (
      <section className="section">
        <div className="columns is-centered">
          <div className="column is-one-third">
            <div className="box">
              <div className="content">
                <h2 className="subtitle">
                  You're invited for trip {this.props.trip}
                </h2>
                <p>
                  Sign in to Trip Builder and join trip {this.props.trip}. Or{" "}
                  <Link
                    to={`/invite/register?token=${this.props.token}`}
                    onClick={() => this.props.setTaskState("register")}
                  >
                    <strong>sign up</strong>
                  </Link>{" "}
                  if you don't have an account.
                </p>
                <LoginForm
                  onSubmitHandler={this.onSubmitHandler}
                  onChangeHandler={this.onChangeHandler}
                />
                {this.state.err && (
                  <code className="is-error">{this.state.err}</code>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
