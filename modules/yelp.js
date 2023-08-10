"use strict";

const axios = require("./axiosInstance");
const { cache, getTTL } = require("./cache.js");

const YELP_API_BASE_URL = "https://api.yelp.com/v3/businesses/search";

const getYelp = ({ query: { searchQuery, lat, lon } }, res, next) => {
  const key = `yelp-${searchQuery}`;
  const queryUrl = `${YELP_API_BASE_URL}?location=${searchQuery}&latitude=${lat}&longitude=${lon}&term=restaurants&open_now=true&sort_by=best_match&limit=20`;
  const headers = {
    Authorization: `Bearer ${process.env.YELP_API_KEY}`,
    accept: "application/json",
  };

  res.status(200);

  if (cache.has(key)) {
    res.send(cache.get(key));
  } else {
    axios(queryUrl, { headers })
      .then(({ data: { businesses } }) => {
        if (businesses) return businesses;
        throw new Error(`No Yelp info found for ${searchQuery}`);
      })
      .then((businessesData) =>
        businessesData.map((business) => new Business(business))
      )
      .then((formattedData) => {
        const ttl = getTTL.daysLater(30);
        cache.set(key, formattedData, { ttl });
        res.send(formattedData);
      })
      .catch((error) => next(error));
  }
};

class Business {
  constructor({ name, image_url, price, rating, url }) {
    this.name = name;
    this.image_url = image_url;
    this.price = price;
    this.rating = rating;
    this.url = url;
  }
}

module.exports = { getYelp };
