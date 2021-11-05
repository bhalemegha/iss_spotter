const request = require('request-promise-native');
const fetchMyIP = function() {
  return (request.get('https://api.ipify.org?format=json'));
}

const fetchCoordsByIP = function() {
  //const ip = JSON.parse(body).ip;
  return (request('https://api.freegeoip.app/json/?apikey=49456c10-3dcf-11ec-ad48-874f42d38e41'));
};
const fetchISSFlyOverTimes = function(body) {
  let jsonBody = JSON.parse(body);
  let lat = jsonBody["latitude"];
  let long = jsonBody["longitude"];
  return (request(`https://iss-pass.herokuapp.com/json/?lat=${lat}&lon=${long}`));
}

const nextISSTimesForMyLocation = function() {
  return fetchMyIP()
  .then(fetchCoordsByIP)
  .then(fetchISSFlyOverTimes)
  .then((data) => {
    const { response } = JSON.parse(data);
    console.log(response);
    return response;
  });
}

module.exports = { nextISSTimesForMyLocation};