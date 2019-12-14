const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  author: {
    type: Schema.ObjectId,
    ref: "User",
    required: "You must supply an author!"
  },
  trip: {
    type: Schema.ObjectId,
    ref: "Trip",
    required: "You must supply a trip!"
  },
  msg: {
    type: String,
    required: "Your message must have text!"
  }
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
