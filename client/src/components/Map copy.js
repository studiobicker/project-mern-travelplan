import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import destinationJson from "../destinations.json";
import React, { Component } from "react";
import MapGL, { Marker } from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
const markerCoord = [52.379189, 4.899431];

export default class Map extends Component {
  constructor() {
    super();
    this.state = {
      viewport: {
        width: "100%",
        height: "100vh",
        latitude: 52.379189,
        longitude: 4.899431,
        zoom: 8
      },
      mapStyle: "mapbox://styles/mapbox/light-v8",
      destinations: destinationJson
    };
  }

  listOfMarkers = () => {
    return this.state.destinations.map((destination, i) => {
      debugger;
      return (
        <Marker
          key={i}
          latitude={destination.latitude}
          longitude={destination.longitude}
          offsetLeft={-20}
          offsetTop={-10}
        >
          <span className="tag is-primary">{destination.name}</span>
        </Marker>
      );
    });
  };

  addDestination = destination => {
    //the person parameter is the state of Modal, and is used to update App's state.
    debugger;
    this.setState({
      destinations: this.state.destinations.concat(destination)
    });
  };

  mapRef = React.createRef();

  handleViewportChange = viewport => {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport }
    });
  };

  // if you are happy with Geocoder default settings, you can just use handleViewportChange directly
  handleGeocoderViewportChange = viewport => {
    const geocoderDefaultOverrides = { transitionDuration: 1000 };
    debugger;
    return this.handleViewportChange({
      ...viewport,
      ...geocoderDefaultOverrides
    });
  };

  handleOnResult = event => {
    const dest = {};
    dest.name = event.result.text;
    dest.longitude = event.result.geometry.coordinates[0];
    dest.latitude = event.result.geometry.coordinates[1];
    this.addDestination(dest);
  };

  render() {
    return (
      <section className="section">
        <div className="columns">
          <div className="column">
            <MapGL
              ref={this.mapRef}
              {...this.state.viewport}
              mapStyle={this.state.mapStyle}
              onViewportChange={this.handleViewportChange}
              mapboxApiAccessToken={MAPBOX_TOKEN}
            >
              {this.listOfMarkers()}
            </MapGL>
          </div>
          <div className="column">
            <Geocoder
              mapRef={this.mapRef}
              mapboxApiAccessToken={MAPBOX_TOKEN}
              onResult={this.handleOnResult}
              onViewportChange={this.handleGeocoderViewportChange}
              mapboxApiAccessToken={MAPBOX_TOKEN}
            />
          </div>
        </div>
      </section>
    );
  }
}
