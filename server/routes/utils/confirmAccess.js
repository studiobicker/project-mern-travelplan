const Membership = require("../../models/Membership");

const confirmAccess = async (req, res, next) => {
  debugger;
  try {
    const members = await Membership.find({ trip: req.params.id }).populate(
      "user"
    );
    for (let i = 0; i < members.length; i++) {
      if (members[i].user.equals(req.session.user._id)) {
        next();
        return false;
      }
    }
    res
      .status(403)
      .json({ message: "You are not authorized to perform this operation" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

module.exports = confirmAccess;
