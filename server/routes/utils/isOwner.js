const Trip = require("../../models/Trip");

const isOwner = async (req, res, next) => {
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
};

module.exports = isOwner;
