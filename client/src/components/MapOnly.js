import React, { Component } from "react";
import Loader from "../components/Loader";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";

import MapGL, { Marker, Source, Layer, FlyToInterpolator } from "react-map-gl";
import WebMercatorViewport from "viewport-mercator-project";
import bbox from "@turf/bbox";
import { lineString } from "@turf/helpers";

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
      level: null,
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

    this.mapRef = React.createRef();
  }

  componentDidMount = async () => {
    try {
      const trip = await this.props.trip;
      const level = await this.props.level;

      const viewport = this.setViewport(trip);

      this.setState({
        trip,
        level,
        viewport,
        isLoadingTrip: false
      });
    } catch (err) {
      console.log(err);
    }
  };

  setViewport = trip => {
    let viewport;
    if (trip.destinations.length > 1) {
      let coordinates = [];
      trip.destinations.map((destination, i) => {
        coordinates[i] = [destination.longitude, destination.latitude];
      });

      const line = lineString(coordinates);

      const [minLng, minLat, maxLng, maxLat] = bbox(line);
      const { longitude, latitude, zoom } = new WebMercatorViewport(
        this.state.viewport
      ).fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat]
        ],
        {
          padding: 40
        }
      );
      viewport = {
        ...this.state.viewport,
        width: "100%",
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

  handleViewportChange = viewport => {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport }
    });
  };

  render() {
    if (this.state.isLoadingTrip)
      return <Loader className="full-screen-loader" />;

    return (
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
        </figure>
      </article>
    );
  }
}
