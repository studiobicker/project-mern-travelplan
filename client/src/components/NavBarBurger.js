import React from "react";

export default function NavBarBurger(props) {
  return (
    <button
      onClick={props.toggleMenu}
      className={`button navbar-burger ${props.active ? "is-active" : ""}`}
    >
      <span />
      <span />
      <span />
    </button>
  );
}
