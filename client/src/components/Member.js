import React from "react";

export default function Member({ index, member, deleteMember, ...props }) {
  debugger;
  return (
    <li>
      <button
        className="button is-medium is-white is-image"
        data-tooltip={member.user.name}
      >
        <figure className="image is-48x48">
          <img className="is-rounded" src={member.user.profilePicture} />
        </figure>
      </button>
    </li>
  );
}
