const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Trip = require("../models/Trip");
const Member = require("../models/Member");

async function confirmCreator(req, res, next) {
  try {
    const trip = await Trip.findById(req.params.id);
    if (trip.creator.equals(req.session.user._id)) next();
    else
      res
        .status(403)
        .json({ message: "You are not authorized to perform this operation" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
}

router.post("/createTrip", async (req, res, next) => {
  const { name, description, tripPicture } = req.body;

  const id = req.session.user._id;

  if (!name) {
    res.status(400).json({ message: "Please provide a name for your trip" });
    return false;
  }
  debugger;
  try {
    const newTrip = await Trip.create({
      name,
      description,
      creator: id,
      tripPicture
    });

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $push: { trips: newTrip._id } },
      { new: true }
    );
    const newMember = await Member.create({
      user: id,
      trip: newTrip._id,
      role: "admin"
    });
    debugger;
    const updatedTrip = await Trip.findByIdAndUpdate(
      newTrip._id,
      { $push: { members: newMember._id } },
      { new: true }
    );

    res.status(200).json(updatedTrip);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Adding your trip failed, please try again" });
  }
});

router.get("/getTripsByUser", async (req, res, next) => {
  try {
    const user = await User.findById(req.session.user._id).populate("trips");
    if (user) {
      res.status(200).json(user.trips);
    }
  } catch (err) {
    res.status(500).json({ message: err });
    console.log(err);
  }
});

router.get("/getTripById/:id", confirmCreator, async (req, res, next) => {
  const tripId = req.params.id;
  try {
    const trip = await Trip.findById(tripId).populate({
      path: "destinations",
      options: { sort: { sequence: 1 } }
    });
    if (trip) {
      res.status(200).json(trip);
    }
  } catch (err) {
    res.status(500).json({ message: err });
    console.log(err);
  }
});

router.get("/remove/:id", confirmCreator, async (req, res, next) => {
  debugger;
  const tripId = req.params.id;

  try {
    const trip = await Trip.findById(tripId).populate("user");
    const creatorId = trip.creator;

    const updatedUser = await User.findByIdAndUpdate(
      creatorId,
      { $pull: { trips: tripId } },
      { new: true }
    );
    const deletedTrip = await Trip.findByIdAndDelete(tripId);
    if (deletedTrip) {
      res.status(200).json({ message: "Trip deleted" });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

module.exports = router;
