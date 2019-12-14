const json = require("./levels.json");

const mongoose = require("mongoose");
const Level = require(__dirname + "/../models/Level.js"); // Import of the model Museum from './models/Museum'

require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to Mongo!");
    return Level.deleteMany({});
  })
  .then(success => {
    return Level.insertMany(json);
  })
  .then(success => {
    console.log("successfully inserted data");
  })
  .catch(err => {
    console.error("Error", err);
  });
