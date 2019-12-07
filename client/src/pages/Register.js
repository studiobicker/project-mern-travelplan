import React, { useState } from "react";
import AuthService from "../api/authService";

export default function Register({ setUserState, history }) {
  const [err, setError] = useState(null);
  const [inputFields, setUser] = useState({
    username: "",
    password: "",
    email: ""
  });
  const authService = new AuthService();

  const onSubmitHandler = async e => {
    e.preventDefault();
    try {
      const user = await authService.register(inputFields);
      setUserState(user);
      history.push("/profile");
    } catch (err) {
      const { message } = err.response.data;
      setError(message);
    }
  };

  const onChangeHandler = e => {
    e.preventDefault();
    const { name, value } = e.target;
    setUser({ ...inputFields, [name]: value });
  };

  return (
    <section className="section">
      <div className="columns is-centered">
        <div className="column is-one-third">
          <form onSubmit={onSubmitHandler}>
            <div className="box">
              <div className="field">
                <label className="label" htmlFor="username">
                  Username
                </label>
                <div className="control has-icons-left has-icons-right">
                  <input
                    className="input"
                    type="text"
                    placeholder="Username"
                    name="username"
                    onChange={onChangeHandler}
                    required
                  />
                  <span className="icon is-small is-left">
                    <i className="fas fa-user"></i>
                  </span>
                </div>
              </div>
              <div className="field">
                <label className="label" htmlFor="password">
                  Password
                </label>
                <div className="control has-icons-left">
                  <input
                    className="input"
                    type="password"
                    placeholder="Password"
                    name="password"
                    onChange={onChangeHandler}
                    required
                  />
                  <span className="icon is-small is-left">
                    <i className="fas fa-lock"></i>
                  </span>
                </div>
              </div>
              <div className="field">
                <label className="label" htmlFor="email">
                  Email
                </label>
                <div className="control has-icons-left ">
                  <input
                    className="input"
                    type="email"
                    placeholder="Email"
                    name="email"
                    onChange={onChangeHandler}
                    required
                  />
                  <span className="icon is-small is-left">
                    <i className="fas fa-envelope"></i>
                  </span>
                </div>
              </div>
              <div className="field is-grouped is-grouped-right">
                <div className="control">
                  <button className="button is-link">Sign up</button>
                </div>
              </div>
            </div>
            {err && <code className="is-error">{err}</code>}
          </form>
        </div>
      </div>
    </section>
  );
}
