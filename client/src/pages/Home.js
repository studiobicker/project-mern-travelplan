import React, { useState } from "react";
import NavBarItems from "../components/NavBar";

export default function Home() {
  return (
    <section className="hero is-bg-img is-fullheight-with-navbar">
      <div className="overlay"></div>
      <div className="hero-body">
        <div className="container has-text-centered">
          <div className="columns is-centered">
            <div className="column is-half">
              <h1 className="title is-2 has-text-white">
                WHERE ARE YOU OFF TO NEXT?
              </h1>
              <h2 className="subtitle has-text-white">
                Plan your vacation with trip builder! Our travel planning tool
                helps you map out your ideal trip, organize all the details, and
                share them with your friends.
              </h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
