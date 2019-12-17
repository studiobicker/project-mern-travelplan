const express = require("express");
const router = express.Router();

const Trip = require("../models/Trip");
const Destination = require("../models/Destination");

async function confirmAuthor(req, res, next) {
  try {
    const trip = await Trip.findById(req.params.id);
    debugger;
    if (trip.creator.equals(req.session.user._id)) next();
    else
      res
        .status(403)
        .json({ message: "You are not authorized to perform this operation" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
}

router.post("/add/:id", confirmAuthor, async (req, res, next) => {
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

router.post("/remove/:id", confirmAuthor, async (req, res, next) => {
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

router.post("/change/:id", confirmAuthor, async (req, res, next) => {
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
