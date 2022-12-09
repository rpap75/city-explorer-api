'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const axios = require('axios');
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const MOVIE_API_KEY = process.env.MOVIE_API_KEY;
const PORT = process.env.PORT || 3001;

app.use(cors());

app.get('/movies', async (request, response) => {

  let url = `https://api.themoviedb.org/3/search/movie?api_key=${MOVIE_API_KEY}&query=${request.query.searchQuery}`;
  // console.log(url);


  let movieResponse = await axios({
    method: 'GET',
    url: url,
  });
  let movieData = movieResponse.data.results;
  console.log('hello hello hello', movieData);

  try {
    let movieArray = movieData.map(movie => new MovieList(movie));
    response.status(200).send(movieArray);
  } catch (e) {
    response.status(500).send('Invalid Search Query');
  }
});


app.get('/weather', async (request, response) => {

  let lat = request.query.lat;
  let lon = request.query.lon;

  let url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${WEATHER_API_KEY}&lat=${lat}&lon=${lon}`;

  let weatherResponse = await axios({
    method: 'GET',
    url: url,
  });
  let weatherData = weatherResponse.data.data;

  try {
    let cityArray = weatherData.map(day => new Forecast(day));
    console.log(cityArray);
    response.status(200).send(cityArray);
  } catch (e) {
    response.status(500).send('Invalid Search Query', e);
  }
});

class MovieList {
  constructor(movie) {
    this.movie = movie;
  }
}

class Forecast {
  constructor(day) {
    this.date = day.valid_date;
    this.description = day.weather.description;
  }
}

app.use('*', (request, response) => {
  response.status(404).send('Invalid Request, route not found');
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));