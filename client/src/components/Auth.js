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

  const [errors, setErrors] = useState([]);

  const handleLoginChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };
  const handleSignupChange = (e) => {
    setSignup({ ...signup, [e.target.name]: e.target.value });
  };
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    try {
      const res = await Axios.post(`/api/auth/`, { ...login });
      authenticate(res.data.token);
    } catch (error) {
      authenticate();
      const resErrors = error.response.data.errors;
      if (resErrors)
        resErrors.map((resError) => {
          setErrors([...errors, resError.msg]);
        });
    }
  };
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    try {
      const res = await Axios.post(`/api/users/`, { ...signup });
      authenticate(res.data.token);
    } catch (error) {
      console.log(error);
      authenticate();
      const resErrors = error.response.data.errors;
      if (resErrors)
        resErrors.map((resError) => {
          setErrors([...errors, resError.msg]);
        });
    }
  };

  return (
    <div className="m-2">
      <h1>{isLogin ? "Login" : "Sign up"}</h1>
      {errors.length > 0 && (
        <div className="alert alert-danger" role="alert">
          {errors.map((error, i) => (
            <div key={i}>{error}</div>
          ))}
        </div>
      )}
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
