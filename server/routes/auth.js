const express = require("express");
const router = express.Router();
const User = require("../models/User");

const bcrypt = require("bcrypt");
const saltRounds = 10; // cost factor for producing the hash

router.post("/register", async (req, res, next) => {
  const { username, password, email, profilePicture } = req.body;
  if (!username || !password || !email) {
    res.status(400).json({ message: "Please provide credentials" });
    return false;
  }

  try {
    //encrpt password
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await User.create({
      username,
      password: hashedPassword,
      email,
      profilePicture
    });
    // dont send password back
    res.status(200).json(newUser);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({
        message: "The username already exist. Please use a different username."
      });
    }
    res.status(500).json({ message: "Registration failed, please try again" });
  }
});

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ message: "Login failed, please try again" });
    return false;
  }

  try {
    const user = await User.findOne({ username });

    if (user) {
      const correctPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (correctPassword) {
        req.session.user = user;
        res.status(200).json(user);
      } else {
        res.status(400).json({ message: "Login failed, please try again" });
      }
    } else {
      res.status(400).json({ message: "Login failed, please try again" });
    }
  } catch (err) {
    res.status(500).json({ message: "Login failed, please try again" });
  }
});

router.get("/logout", (req, res, next) => {
  req.session.destroy();
  res.status(200).json({ message: "User is logged out" });
});

router.get("/isLoggedIn", (req, res, next) => {
  if (req.session.user) {
    res.status(200).json(req.session.user);
  } else {
    res.status(401).json({ message: "Get outta here" });
  }
});

module.exports = router;
