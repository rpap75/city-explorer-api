'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
// const axios = require('axios');
const { handleGetMovies } = require('./movies');
const { handleGetWeather } = require('./weather');
// const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
// const MOVIE_API_KEY = process.env.MOVIE_API_KEY;
const PORT = process.env.PORT || 3002;
// const cache = {};
app.use(cors());

app.get('/movies', handleGetMovies);

app.get('/weather', handleGetWeather);

app.use('*', (request, response) => {
  response.status(404).send('Invalid Request, route not found');
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));