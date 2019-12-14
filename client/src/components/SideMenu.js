import React from "react";
import { Link } from "react-router-dom";

export default function SideMenu({ tripId, ...props }) {
  return (
    <aside className="menu">
      <p className="menu-label">Activity</p>
      <ul className="menu-list">
        <li>
          <Link to={`/travelplan/${tripId}`}>Travel Plan</Link>
        </li>
        <li>
          <Link to={`/tripmembers/${tripId}`}>Trip Members</Link>
        </li>
        <li>
          <Link to={`/messages/${tripId}`}>Messages</Link>
        </li>
      </ul>
    </aside>
  );
}
