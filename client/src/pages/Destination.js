import React, { Component } from "react";
import TripService from "../api/tripService";
import WeatherService from "../api/weatherService";
import PlacesService from "../api/placesService";
import Loader from "../components/Loader";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Place from "../components/Place";

export default class Destination extends Component {
  constructor() {
    super();
    this.state = {
      destination: null,
      level: null,
      places: [],
      isLoadingDestination: true,
      err: null
    };
    this.tripService = new TripService();
    this.weatherService = new WeatherService();
    this.placesService = new PlacesService();
  }

  componentDidMount = async () => {
    const id = this.props.match.params.id;
    try {
      const destination = await this.tripService.getMyDestination(id);

      const currentWeather = await this.weatherService.getWeather(
        destination.myDestination.latitude,
        destination.myDestination.longitude
      );
      debugger;
      this.setState({
        destination: destination.myDestination,
        level: destination.myLevel,
        weather: currentWeather,
        isLoadingDestination: false
      });
    } catch (err) {
      const { message } = err.response.data;
      this.setState({ err: message });
    }
  };

  onSelectHandler = async index => {
    debugger;
    if (index === 1) {
      //do something

      try {
        const location = `${this.state.destination.latitude},${this.state.destination.longitude}`;
        const places = await this.placesService.nearbyPlaces(
          location,
          "3000",
          "point_of_interest",
          ""
        );

        this.setState({ places: places.results });
        debugger;
      } catch (err) {}
    }
  };
  render() {
    if (this.state.isLoadingDestination)
      return <Loader className="full-screen-loader" />;

    return (
      <div>
        <section className="section">
          <div className="container">
            <Tabs onSelect={index => this.onSelectHandler(index)}>
              <TabList className="tabs is-fulwidth is-large">
                <Tab>
                  <div className="react-tabs__tab__label">
                    <span className="icon">
                      <i
                        className="fas fa-map-marker-alt"
                        aria-hidden="true"
                      ></i>
                    </span>
                    <span>Destination</span>
                  </div>
                </Tab>
                <Tab>
                  <div className="react-tabs__tab__label">
                    <span className="icon">
                      <i className="far fa-compass" aria-hidden="true"></i>
                    </span>
                    <span>Explore</span>
                  </div>
                </Tab>
              </TabList>

              <TabPanel>
                <div className="columns">
                  <div className="column is-half">
                    <article className="box extended">
                      <h2 className="title">{this.state.destination.name}</h2>

                      <div className="currentWeather">
                        <div
                          className={`weatherIcon i-${this.state.weather.weather[0].icon}`}
                        ></div>
                        <div className="temp">
                          {this.state.weather.main.temp}&deg;
                        </div>
                        <div className="desc">
                          {this.state.weather.weather[0].description}
                        </div>
                      </div>
                    </article>
                  </div>
                </div>
              </TabPanel>
              <TabPanel>
                <div className="columns is-multiline">
                  {this.state.places.map((place, i) => (
                    <Place key={i} place={place} />
                  ))}
                </div>
              </TabPanel>
            </Tabs>
          </div>
        </section>
      </div>
    );
  }
}
