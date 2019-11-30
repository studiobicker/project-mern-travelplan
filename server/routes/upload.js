const express = require("express");
const router = express.Router();
const uploadCloud = require("../config/uploadCloud");
const User = require("../models/User");

router.post(
  "/profilePicture",
  uploadCloud.single("picture"),
  async (req, res, next) => {
    if (!req.file) {
      res.status(400).json({ message: "Please include a photo" });
      return;
    }
    try {
      const { _id } = req.session.user;
      const user = await User.findByIdAndUpdate(
        _id,
        {
          $set: {
            profilePicture: req.file.url
          }
        },
        {
          new: true
        }
      );

      req.session.user = user;
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

module.exports = router;
