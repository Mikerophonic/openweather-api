export default class WeatherService {
    static getWeather(searchValue){
        return new Promise(function (resolve, reject) {
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
        }
    static getAirPollution(lat, lon) {
      return new Promise(function(resolve, reject) {
        let request = new XMLHttpRequest();
        const airPollutionUrl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${process.env.API_KEY}`;
        request.addEventListener("loadend", function () {
          const airPollutionResponse = JSON.parse(this.responseText);
          if (this.status === 200) {
            resolve(airPollutionResponse);
          } else {
            reject([this, airPollutionResponse]);
          }
        });
        request.open("GET", airPollutionUrl, true);
        request.send();
      });
    }
  }
