import React from "react";
import { Link } from "react-router-dom";

export default function SideMenu({ tripId, ...props }) {
  debugger;
  return (
    <aside className="menu">
      <p className="menu-label">Actions {tripId}</p>
      <ul className="menu-list">
        <li>
          <Link to={`/build-trip/${props._id}`}>Build your trip</Link>
        </li>
        <li>
          <Link to={`/invite-people/${props._id}`}>Invite people</Link>
        </li>
        <li>
          <Link>Write a message</Link>
        </li>
      </ul>
    </aside>
  );
}
