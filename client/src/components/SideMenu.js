import React from "react";
import { Link } from "react-router-dom";

export default function SideMenu({ tripId, ...props }) {
  debugger;
  return (
    <aside className="menu">
      <p className="menu-label">Actions</p>
      <ul className="menu-list">
        <li>
          <Link to={`/build-trip/${tripId}`}>Build your trip</Link>
        </li>
        <li>
          <Link to={`/invite-people/${tripId}`}>Invite people</Link>
        </li>
        <li>
          <Link to={`/write-message/${tripId}`}>Write a message</Link>
        </li>
      </ul>
    </aside>
  );
}
