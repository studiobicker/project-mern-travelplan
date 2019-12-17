import React, { Component } from "react";
import TripService from "../api/tripService";
import Loader from "../components/Loader";
import Destination from "../components/Destination";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { getBounds } from "../utils/functions";

import MapGL, {
  Marker,
  Source,
  Layer,
  LinearInterpolator,
  FlyToInterpolator
} from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import WebMercatorViewport from "viewport-mercator-project";

// 3rd-party easing functions
//import d3 from "d3-ease";

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

export default class TravelPlan extends Component {
  debugger;
  constructor() {
    super();
    this.state = {
      trip: null,
      userLevel: null,
      isLoadingTrip: true,
      viewport: {
        width: 400,
        height: 400,
        longitude: 4.89066,
        latitude: 52.373169,
        zoom: 3
      },
      mapStyle: "mapbox://styles/studiobicker/ck3jwdm2s18n71dmzr1z32dks",
      err: null
    };
    this.tripService = new TripService();
    this.mapRef = React.createRef();
  }

  componentDidMount = async () => {
    const id = this.props.match.params.id;
    try {
      const userTrip = await this.tripService.getTripDestinations(id);

      const viewport = this.setViewport(userTrip.trip);

      this.setState({
        trip: userTrip.trip,
        userLevel: userTrip.level,
        viewport,
        isLoadingTrip: false
      });
    } catch (err) {
      console.log(err);
    }
  };

  setViewport = trip => {
    debugger;
    let longitudes = [];
    let latitudes = [];
    trip.destinations.map((destination, i) => {
      longitudes[i] = parseFloat(destination.longitude);
      latitudes[i] = parseFloat(destination.latitude);
    });

    const bounds = getBounds(longitudes, latitudes);

    let viewport;
    if (trip.destinations.length > 0) {
      const { longitude, latitude, zoom } = new WebMercatorViewport(
        this.state.viewport
      ).fitBounds(bounds, {
        padding: 100
      });
      viewport = {
        ...this.state.viewport,
        width: "100%",
        height: "80vh",
        longitude,
        latitude,
        zoom,
        transitionDuration: 1000,
        transitionInterpolator: new FlyToInterpolator()
      };
    } else {
      viewport = {
        ...this.state.viewport,
        longitude: trip.country.longitude,
        latitude: trip.country.latitude,
        width: "100%",
        height: "80vh",
        transitionDuration: 1000,
        transitionInterpolator: new FlyToInterpolator()
      };
    }

    return viewport;
  };

  listOfMarkers = () => {
    return this.state.trip.destinations.map((destination, i) => {
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

  listOfDestinations = () => {
    return this.state.trip.destinations.map((destination, i) => {
      return (
        <Destination
          key={i}
          index={i}
          destination={destination}
          deleteDestination={this.deleteDestination}
          changeOrderDestination={this.changeOrderDestination}
        >
          <span className="tag is-primary">{destination.name}</span>
        </Destination>
      );
    });
  };

  drawRoute = () => {
    debugger;
    let coordinates = [];
    this.state.trip.destinations.map((destination, i) => {
      coordinates[i] = [destination.longitude, destination.latitude];
    });
    const geojson = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: coordinates
          }
        }
      ]
    };

    return geojson;
  };

  addDestination = async dest => {
    try {
      const tripId = this.state.trip._id;
      const updatedTrip = await this.tripService.addDestination(dest, tripId);

      const viewport = this.setViewport(updatedTrip);

      this.setState({
        trip: updatedTrip,
        viewport
      });
    } catch (err) {
      const { message } = err.response.data;
      this.setState({ err: message });
    }
  };

  deleteDestination = async id => {
    const tripId = this.state.trip._id;
    const updatedTrip = await this.tripService.deleteDestination(id, tripId);

    const viewport = this.setViewport(updatedTrip);

    this.setState({
      trip: updatedTrip,
      viewport
    });
  };

  changeOrderDestination = async (direction, index) => {
    const tripId = this.state.trip._id;
    const destinations = this.state.trip.destinations;
    const destId = destinations[index]._id;
    const destSeq = destinations[index].sequence;
    if (direction === "up" && destinations[index - 1]) {
      /* If selected destination moves up
        selected destination -> sequence of previous destination 
        previous destination -> sequense of selected destination */
      const secondDestId = destinations[index - 1]._id;
      const secondDestSeq = destinations[index - 1].sequence;

      const updatedTrip = await this.tripService.changeOrderDestination(
        { destId, secondDestSeq, secondDestId, destSeq },
        tripId
      );
      this.setState({
        trip: updatedTrip
      });
    } else if (direction === "down" && destinations[index + 1]) {
      /* If selected destination moves down
        selected destination -> sequence of next destination 
        next destination -> sequense of selected destination */

      const secondDestId = destinations[index + 1]._id;
      const secondDestSeq = destinations[index + 1].sequence;

      const updatedTrip = await this.tripService.changeOrderDestination(
        { destId, secondDestSeq, secondDestId, destSeq },
        tripId
      );
      this.setState({
        trip: updatedTrip
      });
    }
  };

  handleViewportChange = viewport => {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport }
    });
  };

  // if you are happy with Geocoder default settings, you can just use handleViewportChange directly
  handleGeocoderViewportChange = viewport => {
    debugger;
    const geocoderDefaultOverrides = { transitionDuration: 1000 };
    return this.handleViewportChange({
      ...viewport,
      ...geocoderDefaultOverrides
    });
  };

  handleGeoResult = event => {
    debugger;
    const dest = {};
    dest.name = event.result.text;
    dest.longitude = event.result.geometry.coordinates[0];
    dest.latitude = event.result.geometry.coordinates[1];
    this.addDestination(dest);
  };

  render() {
    if (this.state.isLoadingTrip)
      return <Loader className="full-screen-loader" />;

    return (
      <div className="section">
        <div className="container">
          <div className="tile is-ancestor">
            <div className="tile is-parent is-8">
              <article className="tile is-child">
                <figure className="image">
                  <MapGL
                    ref={this.mapRef}
                    {...this.state.viewport}
                    mapStyle={this.state.mapStyle}
                    onViewportChange={this.handleViewportChange}
                    mapboxApiAccessToken={MAPBOX_TOKEN}
                  >
                    {this.listOfMarkers()}

                    <Source type="geojson" data={this.drawRoute()}>
                      <Layer {...dataLayer} />
                    </Source>
                  </MapGL>
                  <Geocoder
                    mapRef={this.mapRef}
                    mapboxApiAccessToken={MAPBOX_TOKEN}
                    onResult={this.handleGeoResult}
                    mapboxApiAccessToken={MAPBOX_TOKEN}
                  />
                </figure>
              </article>
            </div>
            <div className="tile is-parent">
              <article className="tile is-child content box">
                <h3 className="subtitle">Add a destination</h3>
                <p className="is-size-7">
                  <i className="far fa-lightbulb"></i> Use the search field on
                  the map canvas
                </p>
                <br />
                <ul>{this.listOfDestinations()}</ul>
              </article>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
