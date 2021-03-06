const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Trip = require("../models/Trip");
const Member = require("../models/Member");

const isMember = require("./utils/isMember");
const isOwner = require("./utils/isOwner");

router.post("/createTrip", async (req, res, next) => {
  const {
    name,
    description,
    country,
    latitude,
    longitude,
    tripPicture
  } = req.body;

  const id = req.session.user._id;

  if (!name) {
    res.status(400).json({ message: "Please provide a name for your trip" });
    return false;
  }

  try {
    const newTrip = await Trip.create({
      name,
      description,
      country: {
        name: country,
        latitude: latitude,
        longitude: longitude
      },
      creator: id,
      tripPicture
    });

    const newMember = await Member.create({
      user: id,
      trip: newTrip._id,
      level: 1
    });

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $push: { trips: newTrip._id },
        $set: { currentTrip: newTrip._id }
      },
      { new: true }
    );

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

router.get("/getMyTrips", async (req, res, next) => {
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

router.get("/getMyTrip/:id", isMember, async (req, res, next) => {
  const tripId = req.params.id;
  try {
    const myTrip = await Trip.findById(tripId).populate({
      path: "destinations members messageboard",
      options: {
        sort: { sequence: 1 }
      },
      populate: { path: "user author" }
    });
    const myLevel = await Member.findOne({
      user: req.session.user,
      trip: tripId
    });

    res.status(200).json({ myTrip, myLevel });
  } catch (err) {
    res.status(500).json({ message: err });
    console.log(err);
  }
});

router.get("/setCurrentTrip/:id", isMember, async (req, res, next) => {
  const tripId = req.params.id;
  try {
    let updatedUser = await User.findByIdAndUpdate(
      req.session.user,
      { $set: { currentTripId: tripId } },
      { new: true }
    );

    req.session.user = updatedUser;
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err });
    console.log(err);
  }
});

router.get("/remove/:id", isOwner, async (req, res, next) => {
  debugger;
  const tripId = req.params.id;

  try {
    const deletedMember = await Member.findOneAndDelete({
      trip: req.params.id,
      user: req.session.user._id
    });

    //ToDo a proper pull on user
    // const updatedUser = await User.findByIdAndUpdate(
    //   creatorId,
    //   { $pull: { trips: tripId } },
    //   { new: true }
    // );
    const deletedTrip = await Trip.findByIdAndDelete(tripId);
    if (deletedTrip) {
      res.status(200).json({ message: "Trip deleted" });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

module.exports = router;
