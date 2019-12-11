const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Trip = require("../models/Trip");
const Invitation = require("../models/Invitation");
const sendEmail = require("./utils/sendEmail");
const crypto = require("crypto");

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

router.get("/accept/:id", async (req, res, next) => {
  const uuid = req.params.id;

  try {
    const invitation = await Invitation.findOne({ uuid });
    if (invitation.email === req.session.user.email) {
      const updatedTrip = await Trip.findByIdAndUpdate(
        invitation.trip,
        {
          $push: { travelers: req.session.user._id },
          $pull: { invitations: invitation._id }
        },

        { new: true }
      );

      const updatedUser = await User.findByIdAndUpdate(
        req.session.user._id,
        { $push: { trips: updatedTrip._id } },
        { new: true }
      );

      const deletedInvitation = await Invitation.findByIdAndDelete(
        invitation._id
      );

      res.status(200).json({ message: "ok" });
    } else {
      res.status(403).json({
        message: "Email address incorrect"
      });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.get(
  "/getTripInvitations/:id",
  confirmCreator,
  async (req, res, next) => {
    const tripId = req.params.id;
    try {
      const trip = await Trip.findById(tripId).populate(
        "invitations travelers"
      );
      if (trip) {
        res.status(200).json(trip);
      }
    } catch (err) {
      res.status(500).json({ message: err });
    }
  }
);

router.post("/send/:id", confirmCreator, async (req, res, next) => {
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
    ).populate("invitations travelers");

    const message = `<strong>You're  invited to join trip ${updatedTrip.name} on TripBuilder</strong>
      <br><br>
      By accepting this invitation you will be able to view, build, and discuss this trip with all other trip members.
      <br><br>
      To accept, click the following link and follow the instructions:
      <br>
      ${inviteUrl}${uuid}
      <br><br>
      <strong>Don’t have a TripBuilder account?</strong> Don’t worry, you can create one when you accept your invitation.
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

router.post("/remove/:id", confirmCreator, async (req, res, next) => {
  const { invitationId } = req.body;
  const tripId = req.params.id;

  try {
    const updatedTrip = await Trip.findByIdAndUpdate(
      tripId,
      { $pull: { invitations: invitationId } },
      { new: true }
    ).populate("travelers invitations");

    const deletedInvitation = await Invitation.findByIdAndDelete(invitationId);

    res.status(200).json(updatedTrip);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Removing a destination failed, please try again" });
    console.log(err);
  }
});

module.exports = router;
