import React, { Component } from "react";
import { Link } from "react-router-dom";
import RegisterForm from "../RegisterForm";
import AuthService from "../../api/authService";

export default class RegisterAccept extends Component {
  constructor() {
    super();
    this.state = {
      err: null,
      name: "",
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
      const user = await this.authService.register({
        name: this.state.name,
        email: this.state.email,
        password: this.state.password
      });
      // accept invitation
      this.props.acceptInvitation();
      this.props.setUserState(user);
      this.props.history.push("/dashboard");
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
                  Sign up for a free Trip Builder account and join trip{" "}
                  {this.props.trip}. Or{" "}
                  <Link
                    to={`/invite/accept?token=${this.props.token}`}
                    onClick={() => this.props.setTaskState("accept")}
                  >
                    <strong>sign in</strong>
                  </Link>{" "}
                  if you already have an account. Sign in to Or if you don't
                  have an account.
                </p>
                <RegisterForm
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
