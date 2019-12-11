import React from "react";

export default function Member({ index, member, deleteMember, ...props }) {
  return (
    <li>
      <div className="memberLi">
        <span>{member.name}</span>
        <span className="deleteMember" onClick={() => deleteMember(member._id)}>
          <i className="fas fa-trash-alt"></i>
        </span>
      </div>
    </li>
  );
}
