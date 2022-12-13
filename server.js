'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const { handleGetMovies } = require('./movies');
const { handleGetWeather } = require('./weather');
const PORT = process.env.PORT || 3002;

app.use(cors());

app.get('/movies', handleGetMovies);

app.get('/weather', handleGetWeather);

app.use('*', (request, response) => {
  response.status(404).send('Invalid Request, route not found');
});

app.listen(process.env.PORT, () => console.log(`listening on ${process.env.PORT}`));
