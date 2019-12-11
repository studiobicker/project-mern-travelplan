import React, { useState } from "react";
import AuthService from "../api/authService";
import LoginForm from "../components/LoginForm";

export default function Login({ setUserState, history }) {
  const [err, setError] = useState(null);
  const [inputFields, setUser] = useState({ email: "", password: "" });

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
            <div className="box">
              <LoginForm
                onSubmitHandler={onSubmitHandler}
                onChangeHandler={onChangeHandler}
              />
              {err && <code className="is-error">{err}</code>}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
