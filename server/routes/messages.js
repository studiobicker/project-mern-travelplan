const express = require("express");
const router = express.Router();
const confirmAccess = require("./utils/confirmAccess");
const User = require("../models/User");
const Trip = require("../models/Trip");
const Message = require("../models/Message");

router.post("/add/:id", confirmAccess, async (req, res, next) => {
  const { msg } = req.body;
  const tripId = req.params.id;
  const user = req.session.user;
  debugger;

  if (!msg) {
    res.status(400).json({ message: "Please provide a message" });
    return false;
  }

  try {
    let newMessage = await Message.create({
      msg,
      author: user,
      trip: tripId
    });
    newMessage = await newMessage.populate("author");

    const updatedTrip = await Trip.findByIdAndUpdate(
      tripId,
      { $push: { messageboard: newMessage._id } },
      { new: true }
    );
    res.status(200).json(newMessage);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Adding a message failed, please try again" });
    console.log(err);
  }
});

router.post("/remove/:id", confirmAccess, async (req, res, next) => {
  const { destinationId } = req.body;
  const tripId = req.params.id;

  try {
    const updatedTrip = await Trip.findByIdAndUpdate(
      tripId,
      { $pull: { destinations: destinationId } },
      { new: true }
    );

    const deletedDestination = await Destination.findByIdAndDelete(
      destinationId
    );

    res.status(200).json({ message: "OK" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Removing a destination failed, please try again" });
    console.log(err);
  }
});

module.exports = router;
