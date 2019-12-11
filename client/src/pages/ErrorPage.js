import React from "react";
import { Link } from "react-router-dom";

export default function ErrorPage({ message }) {
  return (
    <section className="hero is-fullheight-with-navbar">
      <div className="hero-body loader-container">
        <div className="content">
          <h2 className="Subtitle">Something went wrong</h2>
          <p>{message}</p>
        </div>
      </div>
    </section>
  );
}
