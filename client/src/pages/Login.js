import React, { useState } from "react";
import AuthService from "../api/authService";
import NavBar from "../components/NavBar";

export default function Login({ setUserState, history }) {
  const [err, setError] = useState(null);
  const [inputFields, setUser] = useState({ username: "", password: "" });

  const authService = new AuthService();

  const onChangeHandler = e => {
    const { name, value } = e.target;
    setUser({ ...inputFields, [name]: value });
  };

  const onSubmitHandler = async e => {
    e.preventDefault();
    debugger;
    try {
      const user = await authService.login(inputFields);
      setUserState(user);
      history.push("/dashboard");
    } catch (err) {
      const { message } = err.response.data;
      setError(message);
    }
  };

  return (
    <div>
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
                <div className="field is-grouped is-grouped-right">
                  <div className="control">
                    <button className="button is-link">Log in</button>
                  </div>
                </div>
              </div>
              {err && <code className="is-error">{err}</code>}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
