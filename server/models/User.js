const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const checkEmail = email => {
  const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  const emailCheck = emailRegex.test(email);
  return emailCheck;
};

const userSchema = new Schema({
  name: {
    type: String,
    required: "Name is required"
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: [checkEmail, "Please fill in a valid email address"]
  },
  password: {
    type: String,
    required: "Password is required"
  },
  profilePicture: {
    type: String,
    default:
      "https://res.cloudinary.com/drs7qiyrp/image/upload/v1576188722/travelAppAuth/avatar_a0uiq8.jpg"
  },
  currentTripId: { type: String },
  trips: [
    {
      type: Schema.ObjectId,
      ref: "Trip"
    }
  ]
});

const User = mongoose.model("User", userSchema);

module.exports = User;
