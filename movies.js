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
  if (cache[searchQuery]) {

    // console.log('hit cache!');
  } else {
    let movieResponse = await axios({
      method: 'GET',
      url: url,
    });
    let movieData = movieResponse.data.results;
    try {
      let movieArray = movieData.map(movie => new MovieList(movie));
      cache[searchQuery] = movieArray;
    } catch (e) {
      response.status(500).send('Invalid Search Query');
    }
  }
  response.status(200).send(cache[searchQuery]);
}

module.exports = { handleGetMovies };
