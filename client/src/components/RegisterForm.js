import React from "react";

export default function RegisterForm({ onSubmitHandler, onChangeHandler }) {
  return (
    <form onSubmit={onSubmitHandler}>
      <div className="field">
        <label className="label" htmlFor="name">
          Name
        </label>
        <div className="control has-icons-left has-icons-right">
          <input
            className="input"
            type="text"
            placeholder="Jane Smith"
            name="name"
            onChange={onChangeHandler}
            required
          />
          <span className="icon is-small is-left">
            <i className="fas fa-user"></i>
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
            placeholder="jane@example.com"
            name="email"
            onChange={onChangeHandler}
            required
          />
          <span className="icon is-small is-left">
            <i className="fas fa-envelope"></i>
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
          <button className="button is-link">Sign up</button>
        </div>
      </div>
    </form>
  );
}
