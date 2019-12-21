const express = require("express");
const router = express.Router();

const Trip = require("../models/Trip");
const Destination = require("../models/Destination");
const Member = require("../models/Member");
const Location = require("../models/Location");

const isMember = require("./utils/isMember");
const isOwner = require("./utils/isOwner");

router.get("/getById/:id", async (req, res, next) => {
  const destinationId = req.params.id;

  try {
    const myDestination = await Destination.findById(destinationId).populate({
      path: "locations"
    });
    const myLevel = await Member.findOne({
      user: req.session.user,
      trip: myDestination.trip
    });

    res.status(200).json({ myDestination, myLevel });
  } catch (err) {
    res.status(500).json({ message: err });
    console.log(err);
  }
});

router.post("/add/:id", isMember, async (req, res, next) => {
  const { name, latitude, longitude } = req.body;
  const tripId = req.params.id;

  if (!name || !latitude || !longitude) {
    res.status(400).json({ message: "Please provide a destination" });
    return false;
  }

  try {
    const newDestination = await Destination.create({
      name,
      latitude,
      longitude,
      trip: tripId
    });

    const updatedTrip = await Trip.findByIdAndUpdate(
      tripId,
      { $push: { destinations: newDestination._id } },
      { new: true }
    ).populate({
      path: "destinations",
      options: { sort: { sequence: 1 } }
    });
    res.status(200).json(updatedTrip);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Adding a destination failed, please try again" });
    console.log(err);
  }
});

router.post("/remove/:id", isMember, async (req, res, next) => {
  const { destinationId } = req.body;
  const tripId = req.params.id;

  try {
    const updatedTrip = await Trip.findByIdAndUpdate(
      tripId,
      { $pull: { destinations: destinationId } },
      { new: true }
    ).populate({
      path: "destinations",
      options: { sort: { sequence: 1 } }
    });

    const deletedDestination = await Destination.findByIdAndDelete(
      destinationId
    );

    res.status(200).json(updatedTrip);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Removing a destination failed, please try again" });
    console.log(err);
  }
});

router.post("/change/:id", isMember, async (req, res, next) => {
  const { destId, secondDestSeq, secondDestId, destSeq } = req.body;
  const tripId = req.params.id;

  try {
    const firstDest = await Destination.findByIdAndUpdate(destId, {
      $set: { sequence: secondDestSeq }
    });
    const secondDest = await Destination.findByIdAndUpdate(secondDestId, {
      $set: { sequence: destSeq }
    });

    const trip = await Trip.findById(tripId).populate({
      path: "destinations",
      options: { sort: { sequence: 1 } }
    });
    if (trip) {
      res.status(200).json(trip);
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Removing a destination failed, please try again" });
    console.log(err);
  }
});

module.exports = router;
