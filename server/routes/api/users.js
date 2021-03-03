require("dotenv").config();
const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");
const mongoose = require("mongoose");

const User = require("../../models/User");

// @route   GET api/users
// @desc    Get all users
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.aggregate([
      {
        $project: {
          _id: 1,
          username: 1,
        },
      },
    ]);
    res.send(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/users/:id
// @desc    Get a user
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const user = await User.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
      {
        $project: {
          _id: 1,
          username: 1,
        },
      },
    ]);
    res.send(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }
});

// @route   POST api/users
// @desc    Create a user
// @access  Public
router.post(
  "/",
  [
    check("username", "Username is required").not().isEmpty(),
    check("password", "Minimum password length is 8 characters").isLength({ min: 8 }),
  ],
  async (req, res) => {
    // console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }
    let user;
    const { username, password, password2 } = req.body;
    if (password !== password2) return res.status(400).json({ errors: [{ msg: "Passwords don't match", param: "password2" }] });
    try {
      // check if username is already used
      user = await User.findOne({ username: username });
      if (user) return res.status(400).json({ errors: [{ msg: "Username already in use", param: "username" }] });

      // check if an authorized already exists
      let authorizedCount = await User.countDocuments({ authorized: true });
      let authorized = authorizedCount > 0 ? false : true;

      // create the user
      user = new User({ username, password, authorized });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      // verify authorization 
      if(!user.authorized) return res.status(400).json({ errors: [{ msg: "User not authorized", param: "username" }] });

      // return jsonwebtoken
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  }
);

// TODO
// @route   POST api/users
// @desc    Toggle user authorization
// @access  Private

module.exports = router;
