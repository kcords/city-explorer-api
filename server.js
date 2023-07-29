'use strict'

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { getCityForecast } = require('./forecast')

const app = express();

app.use(cors());

const { PORT } = process.env || { PORT: 3002 };

app.get('/', (req, res, next) => {
  res
    .status(200)
    .send('Default route is working!')
})

app.get('/weather', ({query}, res, next) => {
  try {
    const { searchQuery: city_name, lat, lon } = query;
    const cityForecast = getCityForecast({city_name, lat, lon});
    if (!cityForecast) {
      throw new Error(`No forecast found for the requested city ${city_name}`)
    }
    res
      .status(200)
      .send(cityForecast)
  } catch(error) {
    next(error);
  }
})

app.use(({message}, _req, res) => {
  res
    .status(500)
    .send(message)
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))