import { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import Axios from "axios";
import Loading from "./Loading";

const Question = ({
  match: {
    params: { id },
  },
}) => {
  const [question, setQuestion] = useState({});
  const [loading, setLoading] = useState(true);

  const loadQuestion = async (id) => {
    const res = await Axios.get(`/api/questions/${id}`);
    setQuestion(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadQuestion(id);
  }, [id]);

  return (
    <div className="py-2">
      <h1>Question</h1>
      {loading ? (
        <Loading isFullScreen={true} />
      ) : (
        <>
          <b>Name</b>
          <h4>{question.name}</h4>
          <b>E-mail</b>
          <h6 className="mb-2 text-muted">{question.email}</h6>
          <b>Question</b>
          <p>{question.body}</p>
          <a href={`mailto:${question.email}`} class="btn btn-small btn-primary mr-2">
            Reply
          </a>
        </>
      )}
    </div>
  );
};

export default Question;
