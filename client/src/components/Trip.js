import React from "react";

export default function Trip({ trip, onClickTripHandler }) {
  return (
    <div className="column is-12-mobile is-6-tablet is-4-desktop">
      <div
        className="card tripCard"
        onClick={() => onClickTripHandler(trip._id)}
      >
        <div className="card-image">
          <figure className="image is-4by3">
            <img src={trip.tripPicture} alt={trip.name} />
          </figure>
        </div>
        <div className="card-content">
          <p className="title is-6">{trip.name}</p>
        </div>
      </div>
    </div>
  );
}
