import React from "react";

export default function Member({ index, member, deleteMember, ...props }) {
  return (
    <li className="memberLi">
      <figure className="image is-48x48">
        <img className="is-rounded" src={member.user.profilePicture} />
      </figure>
      <strong>{member.user.name}</strong>
    </li>
  );
}
