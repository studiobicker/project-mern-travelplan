import React from "react";

export default function Loader({ className }) {
  return (
    <section className="hero is-fullheight-with-navbar">
      <div className="hero-body loader-container">
        <div className="loader"></div>
      </div>
    </section>
  );
}
