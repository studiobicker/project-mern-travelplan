const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Trip = require("../models/Trip");
const Membership = require("../models/Membership");

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

    const newMember = await Membership.create({
      user: id,
      trip: newTrip._id,
      level: {
        levelname: "admin",
        levelnum: 1
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $push: { memberships: newMember._id },
        $set: { currentTrip: newMember._id }
      },
      { new: true }
    ).populate({
      path: "memberships currentTrip",
      populate: { path: "trip" }
    });

    const updatedTrip = await Trip.findByIdAndUpdate(
      newTrip._id,
      { $push: { members: newMember._id } },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Adding your trip failed, please try again" });
  }
});

router.get("/getTripsByUser", async (req, res, next) => {
  try {
    const user = await User.findById(req.session.user._id).populate({
      path: "memberships",
      populate: { path: "trip" }
    });
    if (user) {
      res.status(200).json(user.memberships);
    }
  } catch (err) {
    res.status(500).json({ message: err });
    console.log(err);
  }
});

router.get("/setCurrentTrip/:id", isMember, async (req, res, next) => {
  const tripId = req.params.id;
  debugger;
  try {
    const membership = await Membership.findOne({
      user: req.session.user,
      trip: tripId
    });
    let updatedUser = await User.findByIdAndUpdate(
      req.session.user,
      { $set: { currentTrip: membership._id } },
      { new: true }
    ).populate({
      path: "memberships currentTrip",
      populate: { path: "trip" }
    });

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err });
    console.log(err);
  }
});

router.get("/getTripById/:id", isMember, async (req, res, next) => {
  const tripId = req.params.id;
  try {
    const membership = await Membership.findOne({
      user: req.session.user._id,
      trip: tripId
    }).populate({
      path: "trip",
      populate: {
        path: "destinations members",
        options: {
          sort: { sequence: 1 }
        }
      }
    });

    res.status(200).json(membership);
  } catch (err) {
    res.status(500).json({ message: err });
    console.log(err);
  }
});

router.get("/remove/:id", isOwner, async (req, res, next) => {
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

router.get("/getTripDestinations/:id", isMember, async (req, res, next) => {
  const tripId = req.params.id;
  try {
    const membership = await Membership.findOne({
      user: req.session.user._id,
      trip: tripId
    }).populate({
      path: "trip",
      populate: {
        path: "destinations",
        options: {
          sort: { sequence: 1 }
        }
      }
    });

    res.status(200).json(membership);
  } catch (err) {
    res.status(500).json({ message: err });
    console.log(err);
  }
});

router.get("/getTripMembers/:id", isMember, async (req, res, next) => {
  const tripId = req.params.id;
  try {
    const membership = await Membership.findOne({
      user: req.session.user._id,
      trip: tripId
    }).populate({
      path: "trip",
      populate: {
        path: "members",
        populate: {
          path: "user"
        }
      }
    });
    res.status(200).json(membership);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.get("/getTripMessages/:id", isMember, async (req, res, next) => {
  const tripId = req.params.id;
  try {
    const membership = await Membership.findOne({
      user: req.session.user._id,
      trip: tripId
    }).populate({
      path: "trip",
      populate: {
        path: "messageboard",
        options: {
          created: { sequence: 1 }
        }
      }
    });

    res.status(200).json(membership);
  } catch (err) {
    res.status(500).json({ message: err });
    console.log(err);
  }
});

module.exports = router;
