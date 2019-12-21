const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tripSchema = new Schema({
  name: {
    type: String,
    required: "Tripname is required"
  },
  country: {
    name: { type: String },
    latitude: { type: Number },
    longitude: { type: Number }
  },
  description: String,
  tripPicture: {
    type: String,
    default:
      "https://res.cloudinary.com/drs7qiyrp/image/upload/v1576756979/travel_hwku04.jpg"
  },
  creator: {
    type: Schema.ObjectId,
    ref: "User",
    required: "You must supply an author!"
  },
  members: [
    {
      type: Schema.ObjectId,
      ref: "Member"
    }
  ],
  destinations: [
    {
      type: Schema.ObjectId,
      ref: "Destination"
    }
  ],
  messageboard: [
    {
      type: Schema.ObjectId,
      ref: "Message"
    }
  ],
  timestamp: { type: Date, default: Date.now }
});

const Trip = mongoose.model("Trip", tripSchema);

module.exports = Trip;
