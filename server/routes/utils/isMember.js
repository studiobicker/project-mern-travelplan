const Member = require("../../models/Member");

const isMember = async (req, res, next) => {
  debugger;
  try {
    const member = await Member.findOne({
      trip: req.params.id,
      user: req.session.user._id
    });
    if (member) {
      next();
      return false;
    }

    res
      .status(403)
      .json({ message: "You are not authorized to perform this operation" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

module.exports = isMember;
