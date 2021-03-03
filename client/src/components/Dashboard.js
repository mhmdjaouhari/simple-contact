import { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import Axios from "axios";
import Loading from "./Loading";

const Dashboard = ({ user, authenticate }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadQuestions = async () => {
    const res = await Axios.get("/api/questions/");
    setQuestions(res.data.questions);
    setLoading(false);
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  return (
    <div className="py-2">
      <h1>All questions</h1>
      {loading ? (
        <Loading isFullScreen={true} />
      ) : (
        questions.map((question) => (
          <div key={question._id} className="card mb-2">
            <div className="card-body">
              <h5 className="card-title">{question.name}</h5>
              <h6 className="card-subtitle mb-2 text-muted">{question.email}</h6>
              <p className="card-text" style={{ textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>
                {question.body}
              </p>
              <a href={`mailto:${question.email}`} className="btn btn-small btn-primary mr-2">
                Reply
              </a>
              <Link to={`/questions/${question._id}`} className="btn btn-small btn-secondary">
                Read more
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Dashboard;
