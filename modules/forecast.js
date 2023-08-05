"use strict";

const axios = require("./axiosInstance");

const WEATHER_API_BASE_URL = "https://api.weatherbit.io/v2.0/forecast/daily";

const getCityForecast = ({ query: { searchQuery, lat, lon } }, res, next) => {
  const queryUrl = `${WEATHER_API_BASE_URL}?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}`;

  axios(queryUrl)
    .then(({ data: { data: forecastData } }) => {
      if (forecastData?.length > 0) return forecastData;
      throw new Error(`No forecast found for ${searchQuery}`);
    })
    .then((forecastData) =>
      forecastData.map((forecast) => new Forecast(forecast))
    )
    .then((formattedForecastData) =>
      res.status(200).send(formattedForecastData)
    )
    .catch((error) => next(error));
};

class Forecast {
  constructor({ datetime, weather: { description } }) {
    this.date = datetime;
    this.description = description;
  }
}

module.exports = { getCityForecast };
