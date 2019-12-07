const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const checkEmail = email => {
  const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  const emailCheck = emailRegex.test(email);
  return emailCheck;
};

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
    required: true,
    validate: [checkEmail, "Please fill in a valid email address"]
  },
  trip: {
    type: Schema.ObjectId,
    ref: "Trip",
    required: true
  }
});

const Invitation = mongoose.model("Invitation", invitationSchema);

module.exports = Invitation;
