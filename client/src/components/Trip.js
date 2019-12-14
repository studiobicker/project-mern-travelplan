import React from "react";
import { Link } from "react-router-dom";

export default function Trip(props) {
  return (
    <div className="box">
      <article className="media">
        <div className="media-left">
          <figure className="image is-128x128">
            <img src={props.trip.tripPicture} alt={props.trip.name} />
          </figure>
        </div>
        <div className="media-content">
          <div className="content">
            <p>
              <strong>{props.trip.name}</strong>
              <br />
              {props.trip.description}
            </p>
            <p></p>
          </div>

          <div className="field is-grouped is-grouped-right">
            <Link
              className="button is-success"
              to={`/travelplan/${props.trip._id}`}
            >
              <span className="icon is-small">
                <i className="fas fa-map-marked-alt"></i>
              </span>
              <span>Go to Travel Plan</span>
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
