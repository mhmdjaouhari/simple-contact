import React, { useState } from "react";
import Axios from "axios";

const Auth = ({ authenticate, isLogin }) => {
  const [login, setLogin] = useState({
    username: "",
    password: "",
  });
  const [signup, setSignup] = useState({
    username: "",
    password: "",
    password2: "",
  });
  const initialAuthValidation = {
    username: {
      valid: null,
      msg: "",
    },
    password: {
      valid: null,
      msg: "",
    },
    password2: {
      valid: null,
      msg: "",
    },
  };
  const [authValidation, setAuthValidation] = useState(initialAuthValidation);

  const handleLoginChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };
  const handleSignupChange = (e) => {
    setSignup({ ...signup, [e.target.name]: e.target.value });
  };
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await Axios.post(`/api/auth/`, { ...login });
      authenticate(res.data.token);
    } catch (error) {
      authenticate();
      // update validation messages
      let validation = initialAuthValidation;
      const errors = error.response.data.errors;
      if (errors)
        errors.map((error) => {
          validation[error.param] = { valid: false, msg: error.msg };
        });
      setAuthValidation(validation);
    }
  };
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await Axios.post(`/api/users/`, { ...signup });
      authenticate(res.data.token);
    } catch (error) {
      authenticate();
      // update validation messages
      let validation = initialAuthValidation;
      const errors = error.response.data.errors;
      if (errors)
        errors.map((error) => {
          validation[error.param] = { valid: false, msg: error.msg };
        });
      setAuthValidation(validation);
    }
  };

  return (
    <div className="m-2">
      <h1>{isLogin ? "Login" : "Sign up"}</h1>
      {isLogin ? (
        <form onSubmit={(e) => handleLoginSubmit(e)}>
          <div className="form-group">
            <input
              required
              type="text"
              name="username"
              placeholder="Your username"
              className="form-control"
              onChange={(e) => handleLoginChange(e)}
            />
          </div>
          <div className="form-group">
            <input
              required
              type="password"
              name="password"
              placeholder="Password"
              className="form-control"
              onChange={(e) => handleLoginChange(e)}
            />
          </div>
          <input type="submit" className="btn btn-primary" value="Log in" />
        </form>
      ) : (
        <form onSubmit={(e) => handleSignupSubmit(e)}>
          <div className="form-group">
            <input
              required
              type="text"
              name="username"
              placeholder="Pick a unique username..."
              className="form-control"
              onChange={(e) => handleSignupChange(e)}
              onBlur={(e) => handleSignupChange(e)}
            />
          </div>
          <div className="form-group">
            <input
              required
              type="password"
              name="password"
              placeholder="Password"
              className="form-control"
              onChange={(e) => handleSignupChange(e)}
              onBlur={(e) => handleSignupChange(e)}
            />
          </div>
          <div className="form-group">
            <input
              required
              type="password"
              name="password2"
              placeholder="Confirm password"
              className="form-control"
              onChange={(e) => handleSignupChange(e)}
              onBlur={(e) => handleSignupChange(e)}
            />
          </div>
          <input type="submit" className="btn btn-primary" value="Sign up" />
        </form>
      )}
    </div>
  );
};

export default Auth;
