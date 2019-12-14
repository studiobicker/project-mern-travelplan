import React, { useState } from "react";
import AuthService from "../api/authService";
import RegisterForm from "../components/RegisterForm";

export default function Register({ setUserState, history }) {
  const [err, setError] = useState(null);
  const [inputFields, setUser] = useState({
    name: "",
    password: "",
    email: ""
  });
  const authService = new AuthService();

  const onSubmitHandler = async e => {
    debugger;
    e.preventDefault();
    try {
      const user = await authService.register(inputFields);
      setUserState(user);
      history.push("/dashboard");
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
          <div className="box">
            <RegisterForm
              onSubmitHandler={onSubmitHandler}
              onChangeHandler={onChangeHandler}
            />
            {err && <code className="is-error">{err}</code>}
          </div>
        </div>
      </div>
    </section>
  );
}
