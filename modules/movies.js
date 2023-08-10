"use strict";

const axios = require("./axiosInstance");
const { cache, getTTL } = require("./cache.js");

const MOVIE_API_BASE_URL = "https://api.themoviedb.org/3/search/movie";
const MOVIE_IMG_BASE_URL = "https://image.tmdb.org/t/p/original";

const getMovies = ({ query: { searchQuery } }, res, next) => {
  const key = `movies-${searchQuery}`;
  const queryUrl = `${MOVIE_API_BASE_URL}?page=1&sort_by=popularity.desc&api_key=${process.env.MOVIE_API_KEY}&query=${searchQuery}`;

  res.status(200);

  if (cache.has(key)) {
    res.send(cache.get(key));
  } else {
    axios(queryUrl)
      .then(({ data: { results: movieData } }) => {
        if (movieData?.length > 0) return movieData;
        throw new Error(`No movies found for ${searchQuery}`);
      })
      .then((movieData) => movieData.map((movie) => new Movie(movie)))
      .then((formattedMovieData) => {
        const ttl = getTTL.endOfDay();
        cache.set(key, formattedMovieData, { ttl });
        res.send(formattedMovieData);
      })
      .catch((error) => next(error));
  }
};

class Movie {
  constructor({
    title,
    overview,
    vote_average,
    vote_count,
    poster_path,
    popularity,
    release_date,
  }) {
    this.title = title;
    this.overview = overview;
    this.average_votes = vote_average;
    this.total_votes = vote_count;
    this.image_url = poster_path ? `${MOVIE_IMG_BASE_URL}${poster_path}` : "";
    this.popularity = popularity;
    this.released_on = release_date;
  }
}

module.exports = { getMovies };
