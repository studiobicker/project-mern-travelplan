const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const invitationSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  uuid: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    required: true
  },
  trip: {
    type: Schema.ObjectId,
    ref: "Trip",
    required: true
  },
  level: {
    type: Number,
    required: true
  },
  author: {
    type: Schema.ObjectId,
    ref: "User",
    required: true
  }
});

const Invitation = mongoose.model("Invitation", invitationSchema);

module.exports = Invitation;
