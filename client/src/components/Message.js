import React from "react";
import Moment from "react-moment";

export default function Message({ message, user }) {
  return (
    <article className="media">
      <figure className="media-left">
        <p className="image is-64x64">
          <img className="is-rounded" src={message.author.profilePicture} />
        </p>
      </figure>
      <div className="media-content">
        <div className="content">
          <p>
            <strong>{message.author.name}</strong>{" "}
            <small>
              <Moment fromNow ago>
                {message.created}
              </Moment>
            </small>
            <br />
            {message.msg}
          </p>
        </div>
      </div>
    </article>
  );
}
