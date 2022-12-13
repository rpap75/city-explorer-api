'use strict';

const MOVIE_API_KEY = process.env.MOVIE_API_KEY;
const axios = require('axios');
const cache = {};


class MovieList {
  constructor(movie) {
    this.movie = movie;
  }
}

async function handleGetMovies(request, response) {

  let url = `https://api.themoviedb.org/3/search/movie?api_key=${MOVIE_API_KEY}&query=${request.query.searchQuery}`;

  let searchQuery = request.query.searchQuery;

  if (cache[searchQuery] && (Date.now() - cache[searchQuery].timestamp < 50000)) {
    console.log('hit cache!');

  } else {
    console.log('cache miss');

    let movieResponse = await axios({
      method: 'GET',
      url: url,
    });

    cache[searchQuery] = {};

    let movieData = movieResponse.data.results;

    try {
      let movieArray = movieData.map(movie => new MovieList(movie));
      cache[searchQuery].results = movieArray;
      cache[searchQuery].timestamp = Date.now();
    } catch (e) {
      response.status(500).send('Invalid Search Query');
    }
  }
  response.status(200).send(cache[searchQuery].results);
}

module.exports = { handleGetMovies };
