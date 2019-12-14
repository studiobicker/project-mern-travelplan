const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const membershipSchema = new Schema({
  trip: {
    type: Schema.ObjectId,
    ref: "Trip",
    required: true
  },
  user: { type: Schema.ObjectId, ref: "User", required: true },
  level: {
    levelname: {
      type: String,
      required: true
    },
    levelnum: {
      type: Number,
      required: true
    }
  }
});

const Membership = mongoose.model("Membership", membershipSchema);

module.exports = Membership;
