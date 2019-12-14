const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const levelSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  level: {
    type: Number
  }
});

const Level = mongoose.model("Level", levelSchema);

module.exports = Level;
