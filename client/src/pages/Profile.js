import React, { createRef, useState } from "react";
import UploadService from "../api/uploadService";

export default function Profile({ user, setUserState }) {
  const uploadService = new UploadService();
  const form = createRef();

  const [err, setError] = useState(null);

  const changeHandler = async e => {
    debugger;
    const { name, value } = e.target;
  };

  const submitHandler = async e => {
    e.preventDefault();
    try {
      const data = new FormData(form.current);
      debugger;
      const user = await uploadService.uploadProfile(data);
      setUserState(user);
      setError(null);
    } catch (err) {
      debugger;
      const { message } = err.response.data;
      setError(message);
    }
  };
  debugger;
  return (
    <section className="section">
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-two-thirds">
            <div className="box">
              {user.profilePicture && (
                <figure className="image is-128x128">
                  <img className="is-rounded" src={user.profilePicture} />
                </figure>
              )}
              <form
                onSubmit={submitHandler}
                ref={form}
                encType="multipart/form-data"
              >
                <input
                  type="file"
                  name="picture"
                  placeholder="upload your profile"
                />
                <button type="submit">Upload photo</button>

                {err && <p>{err}</p>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
