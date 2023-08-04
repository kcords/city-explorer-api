'use strict'

const axios = require("axios");

const WEATHER_API_BASE_URL = "https://api.weatherbit.io/v2.0/forecast/daily";

const getCityForecast = async ({ lat, lon }) => {
  const {
    data: { data: forecastData },
  } = await axios(
    `${WEATHER_API_BASE_URL}?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}`
  );

  const standardizedForecast = forecastData
    ? standardizeForecastData(forecastData)
    : undefined;

  return standardizedForecast;
};

const standardizeForecastData = (forecastData) => forecastData.map(forecast => new Forecast(forecast))

class Forecast {
  constructor({datetime, weather: { description }}) {
    this.date = datetime;
    this.description = description;
  }
}

module.exports = { getCityForecast }