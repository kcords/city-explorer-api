"use strict";

const axios = require("./axiosInstance");
const { cache, getTTL } = require("./cache.js");

const WEATHER_API_BASE_URL = "https://api.weatherbit.io/v2.0/forecast/daily";

const getWeather = ({ query: { searchQuery, lat, lon } }, res, next) => {
  const key = `weather-${searchQuery}-${lat}-${lon}`;
  const queryUrl = `${WEATHER_API_BASE_URL}?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}`;

  res.status(200);

  if (cache.has(key)) {
    res.send(cache.get(key));
  } else {
    axios(queryUrl)
      .then(({ data: { data: forecastData } }) => {
        if (forecastData?.length > 0) return forecastData;
        throw new Error(`No forecast found for ${searchQuery}`);
      })
      .then((forecastData) =>
        forecastData.map((forecast) => new Forecast(forecast))
      )
      .then((formattedForecastData) => {
        const ttl = getTTL.endOfDay();
        cache.set(key, formattedForecastData, { ttl });
        res.send(formattedForecastData);
      })
      .catch((error) => next(error));
  }
};

class Forecast {
  constructor({ datetime, weather: { description } }) {
    this.date = datetime;
    this.description = description;
  }
}

module.exports = { getWeather };
