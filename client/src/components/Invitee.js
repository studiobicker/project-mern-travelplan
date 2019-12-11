import React from "react";

export default function Member({
  index,
  invitation,
  deleteInvitation,
  ...props
}) {
  return (
    <li>
      <div className="memberLi">
        <span>{invitation.email} (pending)</span>
        <span
          className="deleteMember"
          onClick={() => deleteInvitation(invitation._id)}
        >
          <i className="fas fa-trash-alt"></i>
        </span>
      </div>
    </li>
  );
}
