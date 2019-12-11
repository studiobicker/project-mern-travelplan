const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const memberSchema = new Schema({
  user: { type: Schema.ObjectId, ref: "User", required: true },
  role: {
    type: String,
    enum: ["admin", "editor", "subscriber"],
    required: true
  },
  trip: {
    type: Schema.ObjectId,
    ref: "Trip",
    required: "You must supply a trip!"
  }
});

const Member = mongoose.model("Member", memberSchema);

module.exports = Member;
