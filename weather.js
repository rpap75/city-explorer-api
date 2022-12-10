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

  if (cache[searchQuery]) {

    console.log('hit cache!');
  } else {
    console.log('cache miss');

    let weatherResponse = await axios({
      method: 'GET',
      url: url,
    });
    let weatherData = weatherResponse.data.data;

    try {
      let cityArray = weatherData.map(day => new Forecast(day));
      cache[searchQuery] = cityArray;
      // console.log(cityArray);
      // response.status(200).send(cityArray);
    } catch (e) {
      response.status(500).send('Invalid Search Query', e);
    }
  }
  response.status(200).send(cache[searchQuery]);
}

module.exports = { handleGetWeather };
