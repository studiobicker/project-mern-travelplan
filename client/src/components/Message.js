import React from "react";

export default function Message({ message, user }) {
  return (
    <li className={`message ${user === message.user ? "right" : "left"}`}>
      {message.msg}
    </li>
  );
}
