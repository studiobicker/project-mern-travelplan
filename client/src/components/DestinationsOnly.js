import React from "react";
import Destination from "../components/Destination";

export default function DestinationsOnly({ trip }) {
  const listOfDestinations = () => {
    return trip.destinations.map((destination, readOnly, i) => {
      return (
        <Destination
          key={i}
          index={i}
          destination={destination}
          readMode={true}
        ></Destination>
      );
    });
  };

  return (
    <div>
      <ul>{listOfDestinations()}</ul>
    </div>
  );
}
