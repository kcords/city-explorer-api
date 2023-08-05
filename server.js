'use strict'

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { getAreaMap } = require("./modules/map");
const { getCityForecast } = require("./modules/forecast");
const { getTopMovies } = require("./modules/movies");

const app = express();

app.use(cors());

const { PORT } = process.env || { PORT: 3002 };

app.get("/", (req, res, next) => {
  res.status(200).send();
});

app.get("/map", getAreaMap);
app.get("/weather", getCityForecast);
app.get("/movies", getTopMovies);

app.use(({ message }, _req, res, _next) => {
  res.status(500).send(message);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
