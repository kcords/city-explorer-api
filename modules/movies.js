"use strict";

const axios = require("./axiosInstance");

const MOVIE_API_BASE_URL = "https://api.themoviedb.org/3/search/movie";
const MOVIE_IMG_BASE_URL = "https://image.tmdb.org/t/p/original";

const getTopMovies = ({ query: { searchQuery } }, res, next) => {
  const queryUrl = `${MOVIE_API_BASE_URL}?page=1&sort_by=popularity.desc&api_key=${process.env.MOVIE_API_KEY}&query=${searchQuery}`;

  axios(queryUrl)
    .then(({ data }) => {
      if (data?.length > 0) return data;
      throw new Error(`No movies found for ${searchQuery}`);
    })
    .then((data) => data.map((movie) => new Movie(movie)))
    .then((formattedData) => res.status(200).send(formattedData))
    .catch((error) => next(error));
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

module.exports = { getTopMovies };
