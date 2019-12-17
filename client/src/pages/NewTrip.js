import React, { Component } from "react";
import TripService from "../api/tripService";
import CountryService from "../api/countryService";
import Loader from "../components/Loader";
import Select from "react-select";

export default class NewTrip extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      description: "",
      selectedLatLng: null,
      countries: null,
      err: null,
      isLoading: true
    };

    this.tripService = new TripService();
    this.countryService = new CountryService();
  }

  componentDidMount = async () => {
    try {
      const countries = await this.countryService.getAll();
      const countryArray = countries.map(country => {
        return { value: country.latlng, label: country.name };
      });

      this.setState({ countries: countryArray, isLoading: false });
    } catch (err) {
      console.log(err);
    }
  };

  handleSelectChange = selectedLatLng => {
    this.setState({ selectedLatLng });
  };

  onChangeHandler = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  onSubmitHandler = async e => {
    e.preventDefault();
    debugger;
    try {
      const updatedUser = await this.tripService.create(this.state);
      this.props.setUserState(updatedUser);
      debugger;
      this.props.history.push(`/trip/${updatedUser.currentTrip.trip._id}`);
    } catch (err) {
      const { message } = err.response.data;
      this.setState({ err: message });
    }
  };
  render() {
    const { selectedLatLng, countries } = this.state;

    if (this.state.isLoading) return <Loader className="full-screen-loader" />;
    return (
      <section className="section">
        <div className="container">
          <div className="content has-text-centered">
            <h2 className="Subtitle">New Trip</h2>
          </div>
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
                    <label className="label" htmlFor="name">
                      Which country do you want to visit?
                    </label>
                    <Select
                      value={selectedLatLng}
                      onChange={this.handleSelectChange}
                      options={countries}
                    />
                    <p className="help">
                      If you plan to visit multiple countries, just fill in the
                      first one. Don't worry, you can change this later.
                    </p>
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
