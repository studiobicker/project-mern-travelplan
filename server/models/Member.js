const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const memberSchema = new Schema({
  trip: { type: Schema.ObjectId, ref: "Trip", required: true },
  user: { type: Schema.ObjectId, ref: "User", required: true },
  level: { type: Number }
});

const Member = mongoose.model("Member", memberSchema);

module.exports = Member;
