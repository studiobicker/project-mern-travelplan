import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div class="content has-text-centered">
      <h2 className="Subtitle">No trips found</h2>
      <p>Ready to create your first trip?</p>
      <Link className="button is-success" to={`/add-trip`}>
        Add a trip
      </Link>
    </div>
  );
}
