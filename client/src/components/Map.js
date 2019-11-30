import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import destinationJson from "../destinations.json";
import React, { Component } from "react";
import MapGL, { Marker, Source, Layer } from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";

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
    "line-width": 8
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
          [-122.48369693756104, 37.83381888486939],
          [-122.48348236083984, 37.83317489144141],
          [-122.48339653015138, 37.83270036637107],
          [-122.48356819152832, 37.832056363179625],
          [-122.48404026031496, 37.83114119107971],
          [-122.48404026031496, 37.83049717427869],
          [-122.48348236083984, 37.829920943955045],
          [-122.48356819152832, 37.82954808664175],
          [-122.48507022857666, 37.82944639795659],
          [-122.48610019683838, 37.82880236636284],
          [-122.48695850372314, 37.82931081282506],
          [-122.48700141906738, 37.83080223556934],
          [-122.48751640319824, 37.83168351665737],
          [-122.48803138732912, 37.832158048267786],
          [-122.48888969421387, 37.83297152392784],
          [-122.48987674713133, 37.83263257682617],
          [-122.49043464660643, 37.832937629287755],
          [-122.49125003814696, 37.832429207817725],
          [-122.49163627624512, 37.832564787218985],
          [-122.49223709106445, 37.83337825839438],
          [-122.49378204345702, 37.83368330777276]
        ]
      }
    }
  ]
};

export default class Map extends Component {
  constructor() {
    super();
    this.state = {
      viewport: {
        width: "100%",
        height: "100vh",
        longitude: -122.486052,
        latitude: 37.830348,
        zoom: 15
      },
      mapStyle: "mapbox://styles/studiobicker/ck3jwdm2s18n71dmzr1z32dks",
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
    // this.addDestination(dest);
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
              <Source type="geojson" data={geojson}>
                <Layer
                  id="route"
                  type="line"
                  paint={{
                    "line-color": "#888",
                    "line-width": 5.5,
                    "line-dasharray": [1, 2]
                  }}
                  layout={{
                    "line-join": "round",
                    "line-cap": "round"
                  }}
                />
              </Source>
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
