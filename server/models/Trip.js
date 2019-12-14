const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tripSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: "Tripname is required"
  },
  description: String,
  tripPicture: {
    type: String,
    default: "https://media.giphy.com/media/t6conLiC13yyaqgijR/giphy.gif"
  },
  creator: {
    type: Schema.ObjectId,
    ref: "User",
    required: "You must supply an author!"
  },
  members: [
    {
      type: Schema.ObjectId,
      ref: "Membership"
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
