"use strict";

const axios = require("./axiosInstance");
const { cache, getTTL } = require("./cache.js");

const MAP_API_BASE_URL = "https://maps.locationiq.com/v3/staticmap";

const getMap = ({ query: { searchQuery, lat, lon } }, res, next) => {
  const key = `map-${searchQuery}-${lat}-${lon}`;
  const queryUrl = `${MAP_API_BASE_URL}?key=${process.env.MAP_API_KEY}&center=${lat},${lon}&zoom=12&scale=2`;

  res.status(200).type("image/jpeg");

  if (cache.has(key)) {
    res.send(cache.get(key));
  } else {
    axios(queryUrl, {
      responseType: "arraybuffer",
      headers: { Referer: process.env.MAP_REFERER },
    })
      .then(({ data }) => {
        if (data) return data;
        throw new Error(`No map found for ${searchQuery}`);
      })
      .then((data) => {
        const ttl = getTTL.daysLater(30);
        cache.set(key, data, { ttl });
        res.send(data);
      })
      .catch((error) => next(error));
  }
};

module.exports = { getMap };
