const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const mongoose = require("mongoose");
const Question = require("../../models/Question");

// @route   GET api/questions
// @desc    Get all questions
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const questions = await Question.find();
    res.send({ questions });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/questions/:id
// @desc    Get question by id
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: "Question not found" });
    else return res.status(200).send(question);
  } catch (error) {
    console.log(error.message);
    if (error.kind === "ObjectId") return res.status(404).json({ message: "Question not found" });
    res.status(500).send("Server error");
  }
});

// @route   POST api/lists
// @desc    Create a question
// @access  Public
router.post("/", async (req, res) => {
  try {
    const newQuestion = new Question({ ...req.body });
    const question = await newQuestion.save();
    res.json(question);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
