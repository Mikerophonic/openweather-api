import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';

// Business Logic

function getWeather(searchValue) {
  let promise = new Promise(function (resolve, reject) {
    let requestWeather = new XMLHttpRequest();
    let url;
    const isZipCode = /^\d+$/.test(searchValue);

    if (isZipCode) {
      url = `http://api.openweathermap.org/data/2.5/weather?zip=${searchValue}&appid=${process.env.API_KEY}`;
    } else {
      url = `http://api.openweathermap.org/data/2.5/weather?q=${searchValue}&appid=${process.env.API_KEY}`;
    }

    requestWeather.addEventListener("loadend", function () {
      const response = JSON.parse(this.responseText);
      if (this.status === 200) {
        resolve({response, searchValue});
      } else {
        reject([this, response, searchValue])
      }
    });
    requestWeather.open("GET", url, true);
    requestWeather.send();
  });

  promise.then(function (data) {
    const response = data.response;
    const searchValue = data.searchValue;
    const lat = response.coord.lat;
    const lon = response.coord.lon;
    printElements(response, searchValue, lat, lon);
    getAirPollution(lat, lon);
  }, function (response) {
    printError(this, response, searchValue);
  });
}

function getAirPollution(lat, lon) {
  const requestAirPollution = new XMLHttpRequest();
  const airPollutionUrl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${process.env.API_KEY}`
  requestAirPollution.addEventListener("loadend", function () {
    const airPollutionResponse = JSON.parse(this.responseText);
    if (this.status === 200) {
      printAirPollution(airPollutionResponse);
    } else {
      printError(this, airPollutionResponse);
    }
  });
  requestAirPollution.open("GET", airPollutionUrl, true);
  requestAirPollution.send();
}

// UI Logic

function printError(request, apiResponse, searchValue) {
  document.querySelector('#showResponse').innerText = `There was an error accessing the weather data for ${searchValue}: ${request.status} ${request.statusText}: ${apiResponse.message}`;
}

function printElements(apiResponse, searchValue, lat, lon) {
  const fahrenheitTemp = Math.round(100 * ((apiResponse.main.temp - 273.15) * 1.8 + 32) / 100);
  const minTemp = Math.round(100 * ((apiResponse.main.temp_min - 273.15) * 1.8 + 32) / 100);
  const maxTemp = Math.round(100 * ((apiResponse.main.temp_max - 273.15) * 1.8 + 32) / 100);
  const feelsLikeTemp = Math.round(100 * ((apiResponse.main.feels_like - 273.15) * 1.8 + 32) / 100);
  document.querySelector('#showResponse').innerText = `The humidity in ${searchValue} is ${apiResponse.main.humidity}%.
  The temperature in Kelvins is ${apiResponse.main.temp} degrees.
  The temperature in Fahrenheit is ${fahrenheitTemp} degrees.
  The minimum temperature in Fahrenheit is ${minTemp} degrees.
  The maximum temperature in Fahrenheit is ${maxTemp} degrees.
  The weather 'feels' like ${feelsLikeTemp} degrees Fahrenheit.
  The current weather is ${apiResponse.weather[0].description}.
  The wind speed is ${apiResponse.wind.speed} mph.`
  getAirPollution(lat, lon);
}

function printAirPollution(airPollutionResponse) {
  const airQualityIndex = airPollutionResponse.list[0].main.aqi;
  document.querySelector('#showResponse2').innerText = `The air quality index is ${airQualityIndex} (Where 1 = Good, 2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor)`;
}

function handleFormSubmission(event) {
  event.preventDefault();
  const city = document.querySelector('#location').value;
  document.querySelector('#location').value = null;
  getWeather(city);
}

window.addEventListener("load", function () {
  document.querySelector('form').addEventListener("submit", handleFormSubmission);
});