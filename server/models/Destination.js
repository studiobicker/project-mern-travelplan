const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const autoIncrementModelID = require("./Counter");

const destinationSchema = new Schema({
  name: {
    type: String,
    required: "Destination name is required"
  },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  trip: {
    type: Schema.ObjectId,
    ref: "Trip",
    required: "You must supply a trip!"
  },
  locations: [
    {
      type: Schema.ObjectId,
      ref: "Location"
    }
  ],
  sequence: {
    type: Number,
    min: 1
  }
});

destinationSchema.pre("save", function(next) {
  if (!this.isNew) {
    next();
    return;
  }

  autoIncrementModelID(this.trip, this, next);
});

const Destination = mongoose.model("Destination", destinationSchema);

module.exports = Destination;
