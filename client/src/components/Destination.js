import React from "react";
import { Link } from "react-router-dom";

export default function Destination({
  index,
  destination,
  deleteDestination,
  changeOrderDestination,
  readMode,
  ...props
}) {
  if (readMode) {
    return (
      <li>
        <div className="destLi">
          <Link to={`/destination/${destination._id}`}>{destination.name}</Link>
        </div>
      </li>
    );
  } else {
    return (
      <li>
        <div className="destLi">
          <i
            className="fas fa-caret-up"
            onClick={() => changeOrderDestination("up", index)}
          ></i>
          <i
            className="fas fa-caret-down"
            onClick={() => changeOrderDestination("down", index)}
          ></i>

          <Link to={`/destination/${destination._id}`}>{destination.name}</Link>
          <span
            className="is-pulled-right"
            onClick={() => deleteDestination(destination._id)}
          >
            <i className="fas fa-trash-alt"></i>
          </span>
        </div>
      </li>
    );
  }
}
