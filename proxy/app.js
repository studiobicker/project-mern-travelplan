const express = require("express");
const request = require("request");

require("dotenv").config();

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/nearbySearch", (req, res) => {
  debugger;
  request(
    {
      url: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${req.query.location}&radius=${req.query.radius}&type=${req.query.type}&keyword=${req.query.keyword}&key=${req.query.key}`
    },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return res.status(500).json({ type: "error", message: error });
      }
      res.json(JSON.parse(body));
    }
  );
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`listening on ${PORT}`));
