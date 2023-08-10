'use strict'

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { getMap } = require("./modules/map");
const { getWeather } = require("./modules/weather");
const { getMovies } = require("./modules/movies");
const { getYelp } = require("./modules/yelp");

const app = express();

app.use(cors());

const { PORT } = process.env || { PORT: 3002 };

app.get("/", (req, res, next) => {
  res.status(200).send();
});

app.get("/map", getMap);
app.get("/weather", getWeather);
app.get("/movies", getMovies);
app.get("/yelp", getYelp);

app.use(({ message }, _req, res, _next) => {
  res.status(500).send(message);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
