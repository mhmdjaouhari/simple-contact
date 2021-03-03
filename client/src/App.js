import { useState, useEffect, Fragment } from "react";
import { Link, Redirect, Switch, Route, BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import Axios from "axios";
import { setAuthToken } from "./utils";
import Loading from "./components/Loading";
import Auth from "./components/Auth";
import QuestionForm from "./components/QuestionForm";
import Dashboard from "./components/Dashboard";
import Question from "./components/Question";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const authenticate = (token) => {
    if (token) {
      localStorage.setItem("token", token);
      setAuthToken(localStorage.token);
      setIsAuthenticated(true);
      loadUser();
    } else {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const loadUser = async () => {
    try {
      const res = await Axios.get("/api/auth/");
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  const initialize = async () => {
    if (localStorage.token) {
      await loadUser();
    }
    setLoading(false);
  };

  useEffect(() => {
    initialize();
  }, []);

  return loading ? (
    <Loading isFullScreen={true} />
  ) : (
    <Router>
      <nav className="navbar navbar-expand navbar-light bg-light justify-content-between">
        <div className="container">
          <Link className="navbar-brand" to="/">
            Simple Contact
          </Link>
          <ul className="navbar-nav">
            {isAuthenticated === false ? (
              <>
                <Route exact path="/">
                  <li className="nav-item">
                    <Link className="btn btn-outline-primary" to="/login">
                      Login
                    </Link>
                  </li>
                </Route>
                <Route exact path="/login">
                  <li className="nav-item">
                    <Link className="btn btn-outline-primary" to="/signup">
                      Sign up
                    </Link>
                  </li>
                </Route>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="btn btn-outline-primary ml-2" onClick={() => authenticate()}>
                    Logout (<b>{user && user.username}</b>)
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
      <div className="container">
        <div className="col-sm-12 col-md-10 offset-md-1 p-0">
          <Switch>
            {isAuthenticated === true ? (
              <Fragment>
                <Route exact path="/">
                  <Dashboard />
                </Route>
                <Route exact path="/questions/:id" component={({ match }) => <Question match={match} />} />
                <Route exact path="/(login|signup)">
                  <Redirect to="/" />
                </Route>
                <Redirect to="/" />
              </Fragment>
            ) : (
              <Fragment>
                <Route exact path="/" component={QuestionForm} />
                <Route isAuthenticated={isAuthenticated} exact path="/login">
                  <Auth authenticate={authenticate} isLogin={true} />
                </Route>
                <Route exact path="/signup">
                  <Auth authenticate={authenticate} isLogin={false} />
                </Route>
                <Redirect to="/" />
              </Fragment>
            )}
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default App;
