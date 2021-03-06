const express = require("express");
const router = express.Router();
const User = require("../models/User");

const bcrypt = require("bcrypt");
const saltRounds = 10; // cost factor for producing the hash

router.post("/register", async (req, res, next) => {
  const { name, email, password, profilePicture } = req.body;
  if (!name || !password || !email) {
    res.status(400).json({ message: "Please provide credentials" });
    return false;
  }

  try {
    //encrpt password
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await User.create({
      name,
      password: hashedPassword,
      email,
      profilePicture
    });
    // dont send password back
    req.session.user = newUser;
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
  debugger;
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Please enter your login credentials" });
    return false;
  }

  try {
    let user = await User.findOne({ email });

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

router.get("/isLoggedIn", async (req, res, next) => {
  if (req.session.user) {
    res.status(200).json(req.session.user);
  } else {
    res.status(401).json({ message: "Get outta here" });
  }
});

module.exports = router;
