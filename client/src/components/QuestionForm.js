import React, { useState } from "react";
import Axios from "axios";

const QuestionForm = () => {
  const [question, setQuestion] = useState({
    email: "",
    name: "",
    body: "",
  });

  const handleQuestionChange = (e) => {
    setQuestion({ ...question, [e.target.name]: e.target.value });
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await Axios.post(`/api/questions/`, { ...question });
    } catch (error) {
      // TODO add to tooltip array
    }
  };

  return (
    <div className="m-2">
      <h1>Send us a question</h1>
      <p>Get in touch with us!</p>
      <form onSubmit={(e) => handleQuestionSubmit(e)}>
        <div className="form-group">
          <input
            required
            type="email"
            name="email"
            placeholder="Your email address"
            className="form-control"
            onChange={(e) => handleQuestionChange(e)}
          />
        </div>
        <div className="form-group">
          <input
            required
            type="text"
            name="name"
            placeholder="Your full name"
            className="form-control"
            onChange={(e) => handleQuestionChange(e)}
          />
        </div>
        <div className="form-group">
          <textarea
            required
            name="body"
            placeholder="Your question"
            className="form-control"
            onChange={(e) => handleQuestionChange(e)}
          />
        </div>
          <input type="submit" className="btn btn-primary" value="Send" />
      </form>
    </div>
  );
};

export default QuestionForm;
