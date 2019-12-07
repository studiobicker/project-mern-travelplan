const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Trip = require("../models/Trip");
const Destination = require("../models/Destination");
const Invitation = require("../models/Invitation");
const crypto = require("crypto");
const sendEmail = require("./send-email");

router.post("/createTrip", async (req, res, next) => {
  const { name, description, tripPicture } = req.body;

  const id = req.session.user._id;

  if (!name) {
    res.status(400).json({ message: "Please provide a name for your trip" });
    return false;
  }

  try {
    const newTrip = await Trip.create({
      name,
      description,
      creator: id,
      tripPicture
    });
    if (newTrip) {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $push: { trips: newTrip._id } },
        { new: true }
      );
      res.status(200).json(newTrip);
    }
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
  }
});

router.get("/getTripById/:id", async (req, res, next) => {
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
  }
});

async function confirmCreator(req, res, next) {
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

router.post("/invite/:id", confirmCreator, async (req, res, next) => {
  const { email } = req.body;
  const tripId = req.params.id;
  const inviteUrl = process.env.INVITE_URL;

  if (!email) {
    res.status(400).json({ message: "Please provide an email address" });
    return false;
  }

  const uuid = crypto.randomBytes(16).toString("hex");

  try {
    const newInvitation = await Invitation.create({
      email,
      uuid,
      trip: tripId
    });

    const updatedTrip = await Trip.findByIdAndUpdate(
      tripId,
      { $push: { invitations: newInvitation._id } },
      { new: true }
    );

    const message = `<strong>You're  invited to join trip ${updatedTrip.name} on TripBuilder</strong>
      <br><br>
      By accepting this invitation you will be able to view, build, and discuss this trip with all travelers.
      <br><br>
      To accept, click the following link and follow the instructions:
      <br>
      ${inviteUrl}${uuid}
      <br><br>
      <strong>Don’t have a TripBuilder account?</strong> Don’t worry, you can create one when you accept your invite.
      `;

    sendEmail(
      email,
      `You're  invited to join trip ${updatedTrip.name} on TripBuilder`,
      message
    );

    res.status(200).json(updatedTrip);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Sending an invitation failed, please try again" });
    console.log(err);
  }
});

module.exports = router;
