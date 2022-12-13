'use strict';

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const axios = require('axios');
const cache = {};

class Forecast {
  constructor(day) {
    this.date = day.valid_date;
    this.description = day.weather.description;
  }
}

async function handleGetWeather(request, response) {

  let lat = request.query.lat;
  let lon = request.query.lon;

  let url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${WEATHER_API_KEY}&lat=${lat}&lon=${lon}`;

  let searchQuery = request.query.searchQuery;

  if (cache[searchQuery] && (Date.now() - cache[searchQuery].timestamp < 50000)) {
    console.log('weather hit cache!');

  } else {
    console.log('weather cache miss');

    let weatherResponse = await axios({
      method: 'GET',
      url: url,
    });

    cache[searchQuery] = {};

    let weatherData = weatherResponse.data.data;

    try {
      let cityArray = weatherData.map(day => new Forecast(day));
      cache[searchQuery].data = cityArray;
      cache[searchQuery].timestamp = Date.now();
    } catch (e) {
      response.status(500).send('Invalid Search Query', e);
    }
  }

  response.status(200).send(cache[searchQuery].data);
}

module.exports = { handleGetWeather };
