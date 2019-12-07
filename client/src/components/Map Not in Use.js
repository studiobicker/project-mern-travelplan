import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import destinationJson from "../destinations.json";
import React, { Component } from "react";
import MapGL, { Marker, Source, Layer } from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import Loader from "../components/Loader";

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const dataLayer = {
  id: "route",
  type: "line",
  layout: {
    "line-join": "round",
    "line-cap": "round"
  },
  paint: {
    "line-color": "#888",
    "line-width": 2,
    "line-dasharray": [1, 2]
  }
};

const geojson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          // [4.89066, 52.373169],
          // [5.89873, 51.985104]
        ]
      }
    }
  ]
};

export default class Map extends Component {
  constructor(props) {
    debugger;
    super(props);
    this.state = {
      viewport: {
        width: "100%",
        height: "80vh",
        longitude: 4.89066,
        latitude: 52.373169,
        zoom: 6
      },
      mapStyle: "mapbox://styles/studiobicker/ck3jwdm2s18n71dmzr1z32dks",
      destinations: this.props.destinations,
      routeJson: geojson,
      isLoading: true
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

  ListOfCoordinates = () => {
    const coordinates = [];
    return this.state.destinations.map((destination, i) => {
      debugger;
      coordinates[i] = [destination.longitude, destination.latitude];
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
    if (this.state.isLoading) return <Loader className="full-screen-loader" />;
    return (
      <div>
        <MapGL
          ref={this.mapRef}
          {...this.state.viewport}
          mapStyle={this.state.mapStyle}
          onViewportChange={this.handleViewportChange}
          mapboxApiAccessToken={MAPBOX_TOKEN}
        >
          {this.listOfMarkers()}

          <Source type="geojson" data={geojson}>
            <Layer {...dataLayer} />
          </Source>
        </MapGL>
        <Geocoder
          mapRef={this.mapRef}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          onResult={this.handleOnResult}
          onViewportChange={this.handleGeocoderViewportChange}
          mapboxApiAccessToken={MAPBOX_TOKEN}
        />
      </div>
    );
  }
}
