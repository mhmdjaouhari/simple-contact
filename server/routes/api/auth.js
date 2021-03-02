require("dotenv").config();
const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");

const User = require("../../models/User");

// @route   GET api/auth
// @desc    Load current user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }
});

// @route   POST api/auth
// @desc    Log in
// @access  Public
router.post(
  "/",
  [check("username", "Username is required").exists(), check("password", "Password is required").exists()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    let user;
    const { username, password } = req.body;
    try {
      // verify username
      user = await User.findOne({ username: username });
      if (!user) return res.status(400).json({ errors: [{ msg: "Invalid credentials", param: "username" }] });

      // verify password
      const isMatched = await bcrypt.compare(password, user.password);
      if (!isMatched) return res.status(400).json({ errors: [{ msg: "Invalid credentials", param: "password" }] });

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
      console.log(error);
    }
  }
);

module.exports = router;
