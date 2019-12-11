const express = require("express");
const router = express.Router();
const Invitation = require("../models/Invitation");

router.get("/getInvitation/:id", async (req, res, next) => {
  const uuid = req.params.id;
  try {
    const invitation = await Invitation.findOne({ uuid }).populate("trip");
    if (invitation) {
      res.status(200).json(invitation);
    } else {
      res
        .status(403)
        .json({ message: "We cannot find the invitation you’re looking for." });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

module.exports = router;
