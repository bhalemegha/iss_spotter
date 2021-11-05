const request = require("request");
const fetchMyIP = function (callback) {
  request('https://api.ipify.org?format=json', (error, response, body) => {
    if (error) {
      callback(error, null);
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    callback(error, JSON.parse(body).ip);
  });

}

const fetchCoordsByIP = function (ip, callback) {
  request('https://api.freegeoip.app/json/?apikey=49456c10-3dcf-11ec-ad48-874f42d38e41&ip='+ip, (error, response, body) => {
    if (error) {
      callback(error, null);
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const latitudeObj = {};
    latitudeObj["latitude"] = JSON.parse(body).latitude;;
    latitudeObj["longitude"] = JSON.parse(body).longitude;
    callback(error, latitudeObj);
  });
}

const fetchISSFlyOverTimes = function (coords, callback) {
  const lat = coords["latitude"]
  const long = coords["longitude"];
  request(`https://iss-pass.herokuapp.com/json/?lat=${lat}&lon=${long}`, (error, response, body) => {
    if (error) {
      callback(error, null);
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const latitudeObj = {};
    msgObj = (JSON.parse(body)).response;
    callback(error, msgObj);
  });
}

const nextISSTimesForMyLocation = function (callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};

module.exports = { nextISSTimesForMyLocation };