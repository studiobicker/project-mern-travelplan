import React, { Component } from "react";

export default class SendInvitation extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      level: 10
    };
  }

  onChangeHandler = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  onSubmitHandler = async e => {
    e.preventDefault();
    this.props.sendInvitation(this.state);
  };

  render() {
    return (
      <div className="modal is-active">
        <div
          className="modal-background"
          onClick={this.props.toggleModal}
        ></div>
        <div className="modal-card">
          <form onSubmit={this.onSubmitHandler}>
            <header className="modal-card-head">
              <p className="modal-card-title">Send an invitation</p>
            </header>
            <section className="modal-card-body">
              <div className="field">
                <label className="label">Who would you like to invite?</label>
                <p className="control">
                  <input
                    className="input"
                    name="email"
                    onChange={this.onChangeHandler}
                    value={this.state.email}
                    type="email"
                    placeholder="Enter a email address"
                    required
                  />
                </p>
              </div>
              <div className="field">
                <label className="label">What can they do?</label>
                <p className="control">
                  <label className="radio">
                    <input
                      value="5"
                      type="radio"
                      name="level"
                      onChange={this.onChangeHandler}
                      checked={this.state.level == 5}
                    />{" "}
                    Edit the travel plan, invite others and comment it
                  </label>
                  <br />
                  <label className="radio">
                    <input
                      value="10"
                      type="radio"
                      name="level"
                      onChange={this.onChangeHandler}
                      checked={this.state.level == 10}
                    />{" "}
                    View the travel plan and comment it
                  </label>
                </p>
              </div>
            </section>
            <footer className="modal-card-foot">
              <button className="button" onClick={this.props.toggleModal}>
                Cancel
              </button>
              <button className="button is-link">Send</button>
            </footer>
          </form>
        </div>
      </div>
    );
  }
}
