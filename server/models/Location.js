const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const locationSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: "Location name is required"
  },
  latitude: { type: String, required: true },
  longitude: { type: String, required: true },
  destination: {
    type: Schema.ObjectId,
    ref: "Destination",
    required: "You must supply a destination!"
  }
});

const Location = mongoose.model("Location", locationSchema);

module.exports = Location;
