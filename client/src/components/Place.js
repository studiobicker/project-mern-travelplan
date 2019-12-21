import React from "react";

const showStars = rating => {
  debugger;
  console.log(rating);
};

export default function Place({ place, savePlaceToDestination }) {
  return (
    <div className="column is-12-mobile is-6-tablet is-4-desktop">
      <div className="card">
        <div className="card-image">
          <figure className="image is-4by3">
            <img
              src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=AIzaSyDCtq4no9g9mwzqZsa0RNhX3abeC0aRSsc`}
              alt={place.name}
            />
          </figure>
        </div>
        <div className="card-content">
          <div className="content">
            <p className="title is-6">{place.name}</p>
            <p>
              {() => showStars(place.rating)}
              <small>({place.user_ratings_total})</small>
            </p>
          </div>
          <button className="button is-link is-fullwidth">
            <span className="icon">
              <i className="fas fa-plus"></i>
            </span>
            <span>Add to destination</span>
          </button>
        </div>
      </div>
    </div>
  );
}
