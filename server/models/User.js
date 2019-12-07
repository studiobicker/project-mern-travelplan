const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const checkEmail = email => {
  const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  const emailCheck = emailRegex.test(email);
  return emailCheck;
};

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: "Username is required"
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
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/SNice.svg/440px-SNice.svg.png"
  },
  trips: [
    {
      type: Schema.ObjectId,
      ref: "Trip",
      required: "You must supply a trip!"
    }
  ]
});

const User = mongoose.model("User", userSchema);

module.exports = User;
