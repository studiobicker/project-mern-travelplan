import React from "react";

export default function Destination({
  index,
  destination,
  deleteDestination,
  changeOrderDestination,
  ...props
}) {
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

        <span>
          {destination.sequence} {destination.name}
        </span>
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
