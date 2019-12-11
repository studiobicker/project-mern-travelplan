import React, { Component } from "react";
import TripService from "../api/tripService";

export default class NewTrip extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      description: "",
      err: null
    };

    this.tripService = new TripService();
  }

  onChangeHandler = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  onSubmitHandler = async e => {
    e.preventDefault();
    debugger;
    try {
      const trip = await this.tripService.create(this.state);
      this.props.history.push(`/build-trip/${trip._id}`);
    } catch (err) {
      const { message } = err.response.data;
      this.setState({ err: message });
    }
  };
  render() {
    return (
      <section className="section">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-half">
              <form onSubmit={this.onSubmitHandler}>
                <div className="box">
                  <div className="field">
                    <label className="label" htmlFor="name">
                      What's the name of your trip
                    </label>
                    <div className="control">
                      <input
                        className="input"
                        type="text"
                        placeholder="Name of your trip"
                        name="name"
                        onChange={this.onChangeHandler}
                        required
                      />
                    </div>
                  </div>
                  <div className="field">
                    <label className="label" htmlFor="description">
                      A few words about your trip
                    </label>
                    <div className="control">
                      <textarea
                        className="textarea"
                        placeholder="Description"
                        name="description"
                        onChange={this.onChangeHandler}
                      />
                    </div>
                  </div>

                  <div className="field is-grouped is-grouped-right">
                    <div className="control">
                      <button className="button is-link">Create trip</button>
                    </div>
                  </div>
                </div>
                {this.state.err && (
                  <code className="is-error">{this.state.err}</code>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
