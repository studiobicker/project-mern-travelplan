import React from "react";

import { Link } from "react-router-dom";
export default function Accept({ trip, acceptInvitation }) {
  return (
    <section className="section">
      <div className="columns is-centered">
        <div className="column is-one-third">
          <div className="box">
            <div className="content">
              <h2 className="subtitle">You're invited for trip {trip}</h2>
              <p>
                By accepting this invitation you will be able to view, build,
                and discuss this trip with all other trip members.
              </p>
            </div>
            <div className="field is-grouped">
              <p className="control">
                <Link className="button" to="/dashboard">
                  Cancel
                </Link>
              </p>
              <p className="control">
                <button className="button is-link" onClick={acceptInvitation}>
                  Accept
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
