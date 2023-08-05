"use strict";

const axios = require("./axiosInstance");

const WEATHER_API_BASE_URL = "https://api.weatherbit.io/v2.0/forecast/daily";

const getCityForecast = ({ query: { searchQuery, lat, lon } }, res, next) => {
  const queryUrl = `${WEATHER_API_BASE_URL}?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}`;

  axios(queryUrl)
    .then(({ data }) => {
      if (data?.length > 0) return data;
      throw new Error(`No forecast found for ${searchQuery}`);
    })
    .then((data) => data.map((forecast) => new Forecast(forecast)))
    .then((formattedData) => res.status(200).send(formattedData))
    .catch((error) => next(error));
};

class Forecast {
  constructor({ datetime, weather: { description } }) {
    this.date = datetime;
    this.description = description;
  }
}

module.exports = { getCityForecast };
