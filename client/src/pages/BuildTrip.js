import React, { Component } from "react";
import TripService from "../api/tripService";
import Loader from "../components/Loader";
import Destination from "../components/Destination";
import SideMenu from "../components/SideMenu";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";

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
    "line-width": 2,
    "line-dasharray": [1, 2]
  }
};

export default class BuildTrip extends Component {
  constructor() {
    super();
    this.state = {
      trip: null,
      isLoadingTrip: true,
      viewport: {
        width: "100%",
        height: "80vh",
        longitude: 4.89066,
        latitude: 52.373169,
        zoom: 6
      },
      mapStyle: "mapbox://styles/studiobicker/ck3jwdm2s18n71dmzr1z32dks",
      err: null
    };
    this.tripService = new TripService();
  }

  componentDidMount = async () => {
    const id = this.props.match.params.id;
    debugger;
    try {
      const trip = await this.tripService.getTripById(id);

      this.setState({
        trip,
        isLoadingTrip: false
      });
    } catch (err) {
      console.log(err);
    }
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
      const newDestination = await this.tripService.addDestination(
        dest,
        tripId
      );
      this.setState({
        trip: {
          ...this.state.trip,
          destinations: this.state.trip.destinations.concat(newDestination)
        }
      });
    } catch (err) {
      const { message } = err.response.data;
      this.setState({ err: message });
    }
  };

  deleteDestination = async id => {
    const tripId = this.state.trip._id;
    const deletedDestination = await this.tripService.deleteDestination(
      id,
      tripId
    );

    this.setState({
      trip: {
        ...this.state.trip,
        destinations: this.state.trip.destinations.filter(
          dest => dest._id !== id
        )
      }
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

  mapRef = React.createRef();

  handleViewportChange = viewport => {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport }
    });
  };

  // if you are happy with Geocoder default settings, you can just use handleViewportChange directly
  handleGeocoderViewportChange = viewport => {
    const geocoderDefaultOverrides = { transitionDuration: 1000 };
    return this.handleViewportChange({
      ...viewport,
      ...geocoderDefaultOverrides
    });
  };

  handleGeoResult = event => {
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
      <div>
        <div className="columns is-gapless">
          <div className="column">
            <div className="column-padding">
              <SideMenu tripId={this.state.trip._id} />
            </div>
          </div>
          <div className="column is-four-fifths">
            <div className="column-padding">
              <div className="card is-horizontal">
                <div className="card-image">
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
                      onViewportChange={this.handleGeocoderViewportChange}
                      mapboxApiAccessToken={MAPBOX_TOKEN}
                    />
                  </figure>
                </div>

                <div className="card-content">
                  <p className="is-size-5">
                    <strong>{this.state.trip.name}</strong>
                  </p>
                  <p>{this.state.trip.description}</p>
                  <br />
                  <p>
                    <strong>Add a destination</strong>
                  </p>
                  <p className="is-size-7">
                    <i className="far fa-lightbulb"></i> Use the search field on
                    the map canvas
                  </p>
                  <br />
                  <ul>{this.listOfDestinations()}</ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
