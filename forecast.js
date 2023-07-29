'use strict'

const weatherData = require('./data/weather.json');

const getCityForecast = ({city_name, lat, lon}) => {
  const { data: forecastData } = weatherData.find((city) => {
    if (city.city_name.toLowerCase() === city_name.toLowerCase()
        && city.lat === lat
        && city.lon === lon) return true;
    return false;
  }) || {};

  const standardizedForecast = forecastData ? standardizeForecastData(forecastData) : undefined;

  return standardizedForecast;
}

const standardizeForecastData = (forecastData) => forecastData.map(forecast => new Forecast(forecast))

class Forecast {
  constructor({datetime, weather: { description }}) {
    this.date = datetime;
    this.description = description;
  }
}

module.exports = { getCityForecast }