import React from "react";

export default function LoginForm({ onSubmitHandler, onChangeHandler }) {
  return (
    <form onSubmit={onSubmitHandler}>
      <div className="field">
        <label className="label" htmlFor="email">
          Email
        </label>
        <div className="control has-icons-left has-icons-right">
          <input
            className="input"
            type="email"
            placeholder="jane@example.com"
            name="email"
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
          <button className="button  is-link">Log in</button>
        </div>
      </div>
    </form>
  );
}
