import React from "react";
import { Link } from "react-router-dom";

export default function Trip(props) {
  return (
    <div className="box">
      <article className="media">
        <div className="media-left">
          <figure className="image is-128x128">
            <img src={props.tripPicture} alt={props.name} />
          </figure>
        </div>
        <div className="media-content">
          <div className="content">
            <p>
              <strong>{props.name}</strong>
              <br />
              {props.description}
            </p>
          </div>
          <div className="field is-grouped is-grouped-right">
            <Link className="button is-success" to={`/build-trip/${props._id}`}>
              <span className="icon is-small">
                <i className="fas fa-map-marked-alt"></i>
              </span>
              <span>Build your trip</span>
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
