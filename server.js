'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./data/weather.json');
const app = express();



app.use(cors());
const PORT = process.env.PORT || 3001;
app.get('/weather', (request, response, next) => {
  console.log('inside weather route');

  let { searchQuery } = request.query;
  console.log(searchQuery);

  let city = db.find(cityName => cityName.city_name.toLocaleLowerCase() === searchQuery.toLocaleLowerCase());
  console.log(city);

  try {
    let cityArray = city.data.map(day => new Forecast(day));
    console.log(cityArray);
    response.status(200).send(cityArray);
  } catch (e) {
    response.status(500).send('Invalid Search Query', e);
  }
});

function Forecast(day) {
  this.date = day.valid_date;
  this.description = day.weather.description;
}

app.use('*', (request, response, next) => {
  response.status(404).send('Invalid Request, route not found');
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));