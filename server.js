'use strict'

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { getCityForecast } = require('./forecast')
const { getTopMovies } = require("./movies");

const app = express();

app.use(cors());

const { PORT } = process.env || { PORT: 3002 };

app.get("/", (req, res, next) => {
  res.status(200).send("Default route is working!");
});

app.get("/weather", async ({ query: { searchQuery, lat, lon } }, res, next) => {
  try {
    const cityForecast = await getCityForecast({ lat, lon });

    if (!cityForecast) {
      throw new Error(
        `No forecast found for the requested city ${searchQuery}`
      );
    }
    res.status(200).send(cityForecast);
  } catch (error) {
    next(error);
  }
});

app.get("/movies", async ({ query: { searchQuery } }, res, next) => {
  try {
    const topMovies = await getTopMovies({ searchQuery });

    if (!topMovies) {
      throw new Error(`No movies found for the requested city ${searchQuery}`);
    }
    res.status(200).send(topMovies);
  } catch (error) {
    next(error);
  }
});

app.use(({message}, _req, res, _next) => {
  res
    .status(500)
    .send(message)
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))