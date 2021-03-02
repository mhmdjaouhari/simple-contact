const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
});

module.exports = Question = mongoose.model("question", QuestionSchema);
