"use strict";

const axios = require("./axiosInstance");

const MAP_API_BASE_URL = "https://maps.locationiq.com/v3/staticmap";

const getAreaMap = ({ query: { searchQuery, lat, lon } }, res, next) => {
  const queryUrl = `${MAP_API_BASE_URL}?key=${process.env.MAP_API_KEY}&center=${lat},${lon}&zoom=12&scale=2`;

  axios(queryUrl, {
    responseType: "arraybuffer",
    headers: { Referer: process.env.MAP_REFERER },
  })
    .then(({ data }) => {
      if (data) return data;
      throw new Error(`No map found for ${searchQuery}`);
    })
    .then((data) => res.status(200).type("image/jpeg").send(data))
    .catch((error) => next(error));
};

module.exports = { getAreaMap };
