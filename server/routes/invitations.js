const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Trip = require("../models/Trip");
const Invitation = require("../models/Invitation");
const Membership = require("../models/Membership");
const Level = require("../models/Level");
const sendEmail = require("./utils/sendEmail");
const crypto = require("crypto");

const isMember = require("./utils/isMember");
const isOwner = require("./utils/isOwner");

router.get("/accept/:id", async (req, res, next) => {
  const uuid = req.params.id;
  debugger;
  try {
    const invitation = await Invitation.findOne({ uuid });

    const newMember = await Membership.create({
      user: req.session.user,
      trip: invitation.trip,
      level: {
        levelname: invitation.level.levelname,
        levelnum: invitation.level.levelnum
      }
    });

    const updatedTrip = await Trip.findByIdAndUpdate(
      invitation.trip,
      {
        $push: { members: newMember._id }
      },

      { new: true }
    );

    const updatedUser = await User.findByIdAndUpdate(
      req.session.user._id,
      { $push: { memberships: newMember._id } },
      { new: true }
    );

    const deletedInvitation = await Invitation.findByIdAndDelete(
      invitation._id
    );

    res.status(200).json({ message: "ok" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.get("/compare/:id", async (req, res, next) => {
  const id = req.params.id;
  const userEmail = req.session.user.email;
  debugger;
  try {
    const invitation = await Invitation.findById(id);

    const hashedEmail = crypto
      .createHash("md5")
      .update(userEmail)
      .digest("hex");

    if (invitation.email === hashedEmail) {
      res.status(200).json({ result: true });
    } else {
      res.status(200).json({ result: false });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.post("/send/:id", isMember, async (req, res, next) => {
  //ToDo check if member has sufficient rights for sending an invitation
  const { email, level } = req.body;
  const tripId = req.params.id;
  const user = req.session.user;
  const inviteUrl = process.env.INVITE_URL;

  if (!email) {
    res.status(400).json({ message: "Please provide an email address" });
    return false;
  }

  const uuid = crypto.randomBytes(16).toString("hex");

  const hashedEmail = crypto
    .createHash("md5")
    .update(email)
    .digest("hex");

  try {
    debugger;
    const lookupLevel = await Level.findOne({ level });

    const newInvitation = await Invitation.create({
      uuid,
      email: hashedEmail,
      trip: tripId,
      level: {
        levelname: lookupLevel.name,
        levelnum: lookupLevel.level
      },
      author: user
    });

    const trip = await Trip.findById(tripId);

    const message = `<strong>${user.name}(${user.email}) has invited you to join trip ${trip.name} on TripBuilder</strong>
      <br><br>
      By accepting this invitation you will be able to view, build and discuss this trip with all other trip members.
      <br><br>
      To accept, click the following link and follow the instructions:
      <br>
      ${inviteUrl}${uuid}
      <br><br>
      <strong>Don’t have a TripBuilder account?</strong> Don’t worry, you can create one when you accept your invitation.
      `;

    sendEmail(
      email,
      `You're  invited to join trip ${trip.name} on TripBuilder`,
      message
    );

    res.status(200).json({ message: `Invitation is send to ${email} ` });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Sending an invitation failed, please try again" });
    console.log(err);
  }
});

module.exports = router;
