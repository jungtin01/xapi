var request = require('request');
var logger=require('./logging.js');
var SerialPort = require('serialport');
var config = require('./config.js');

var port = new SerialPort('/dev/ttyS2', {baudRate: 9600});

// --------------------------
// Forward request to server
// --------------------------
const URLBASE = "http://localhost:1248";
const URLLOGIN =  URLBASE + "/api/authorization";
const URLREWREQ = URLBASE + "/api/request";
const URLCANCEL = URLBASE + "/api/close-last-request/";
var UserToken = "";
var LastRequests = {};

const REQCODES = {
  "three_buttons": {
    "0010": "C",  // Call employee
    "0100": "B",  // Pay the bill
    "1000": "X",  // Cancel previous request
  },
  "four_buttons": {
    "0001": "M",  // Order (menu)
    "0010": "C",  // Call employee
    "0100": "B",  // Pay the bill
    "1000": "X",  // Cancel previous request
  },
  "five_buttons": {
    "0100": "M",  // Order (menu)
    "1001": "W",  // Water
    "0010": "C",  // Call employee
    "1000": "B",  // Pay the bill
    "0001": "X",  // Cancel previous request
  },
};

logger.debug("Starting xrobot with device type: " + config.deviceType);
logger.debug("Request Codes: " + JSON.stringify(REQCODES[config.deviceType]));

function authenticate() {
  logger.debug("Authenticating...");
  // login
  request.post(URLLOGIN, {form: {username:"admin", password: "123456789"}},
    function (error, response, body) {
      if (error) {
        logger.debug("[Authentication] Error:" + error);
        return;
      }
      if (response.statusCode !== 200) {
        logger.debug("[Authentication] Unexpected status code: " + response.statusCode);
        return;
      }

      body = JSON.parse(body);
      if (!body.status) {
        logger.debug("[Authentication] Could not parse body into json obj");
        return;
      } else if (body.status !== "success") {
        logger.debug("[Authentication] Request is failed: " + JSON.stringify(body));
        return;
      }

      UserToken = body.result.token;
      logger.debug("[Authentication] token " + UserToken);
      // logger.debug(typeof(body));
      // logger.debug(body.status);
      // logger.debug(body.result.token);
      // logger.debug(body.result.userId);
      // logger.debug(body.result.userName);
    });
};
// Get new token
authenticate();

function isDuplicated(deviceId, reqType) {
  // Within 5s, all same requests will be marked as duplicated
  let now = Date.now();

  if (!LastRequests.hasOwnProperty(deviceId)) {
    logger.debug("Fresh request from " + deviceId);
    LastRequests[deviceId] = {"reqType": reqType, "lastTime": now};
    return false;
  }

  // if (LastRequests[deviceId].reqType != reqType) {
    // logger.debug("New req " + reqType + " for " + deviceId);
    // LastRequests[deviceId] = {"reqType": reqType, "lastTime": now};
    // return false;
  // }

  let lastTime = LastRequests[deviceId].lastTime;
  let delta = now - lastTime;
  logger.debug("table " + deviceId + " lastTime " + lastTime + " now " + now + " delta " + delta);
  if (delta > 5*1000) {
    // logger.debug("Accept this new request");
    LastRequests[deviceId] = {"reqType": reqType, "lastTime": now};
    return false;
  }

  return true;
}

function sendCustomerRequest(deviceId, reqType) {
  logger.debug("Sending " + reqType + " from " + deviceId);

  request.post(URLREWREQ, {form: {xcallerId: deviceId, requestType: reqType}, 'auth': { 'bearer': UserToken }},
    function (error, response, body) {
      if (error) {
        logger.debug("[Req] err: " + error);
        authenticate();
        return;
      }
      if (response.statusCode !== 200) {
        logger.debug("[Req] unexpected statusCode " + response.statusCode);
        logger.debug("[Req] unexpected response " + JSON.parse(JSON.stringify(body)));
        authenticate();
        return;
      }

      body = JSON.parse(body);
      if (!body.status) {
        logger.debug("[Req] Could not parse body into json obj");
        authenticate();
        return;
      } else if (body.status !== "success") {
        logger.debug("[Req] Request is failed: " + JSON.stringify(body));
        // authenticate();
        return;
      }

      logger.debug("[Req] response body: " + JSON.stringify(body));
    });
};

function cancelLastCustomerRequest(deviceId, reqType) {
  logger.debug("Sending " + reqType + " from " + deviceId);

  request.put(URLCANCEL + deviceId, {'auth': { 'bearer': UserToken }},
    function (error, response, body) {
      if (error) {
        logger.debug("[CANCEL] err: " + error);
        authenticate();
        return;
      }
      if (response.statusCode !== 200) {
        logger.debug("[CANCEL] unexpected statusCode " + response.statusCode);
        logger.debug("[CANCEL] unexpected response " + JSON.parse(JSON.stringify(body)));
        authenticate();
        return;
      }

      body = JSON.parse(body);
      if (!body.status) {
        logger.debug("[CANCEL] Could not parse body into json obj");
        authenticate();
        return;
      } else if (body.status !== "success") {
        logger.debug("[CANCEL] Request is failed: " + JSON.stringify(body));
        // authenticate();
        return;
      }

      logger.debug("[CANCEL] response body: " + JSON.stringify(body));
    });
};


// ------------------------
// Process ttyS2 data
// ------------------------

function parseData(data, fromIdx, toIdx) {
  let msgobj = {str:"", valid: true};
  for (let i = fromIdx; i <= toIdx; i++) {
    if (data[i] !== 48 && data[i] !== 49) {
      msgobj.valid = false;
    }
    msgobj.str += String.fromCharCode(data[i]);
  }

  return msgobj;
}

function stringBuilder(data, fromIdx, toIdx) {
  let str = '';
  for (let i = fromIdx; i <= toIdx; i++) {
    // logger.debug("code data " + data[i]);
    str += String.fromCharCode(data[i]);
  }
  // logger.debug("output str " + str);
  return str;
}

function getRequestType(data, fromIdx, toIdx){
  // logger.debug("getRequestType " + data  + " / " + fromIdx + " / " + toIdx);
  let reqType = stringBuilder(data, fromIdx, toIdx);
  // logger.debug("reqType " + reqType);
  return REQCODES[config.deviceType][reqType];
};

function getDeviceId(data, fromIdx, toIdx){
  // logger.debug("getDeviceId " + data  + " / " + fromIdx + " / " + toIdx);
  let id = stringBuilder(data, fromIdx, toIdx);
  return id;
};

// Open errors will be emitted as an error event
port.on('error', function(err) {
  logger.debug("[on-error] Opening serial Error: " + err.message);
})

// Switches the port into "flowing mode"
port.on('data', function (data) {
  // logger.debug("\n");
  // logger.debug("[on data]:     " + data + " length " + data.length);
  if (data.length !== 26) {
    logger.debug("unexpected msg length from: " + data);
    return;
  }

  // data format (26 bytes):
  //  + id:               first 20 bytes (0  - 19)
  //  + request type:     4 bytes        (20 - 23)
  //  + EOL (\r\n):       last 2 bytes   (24 - 25)
  let msgobj = parseData(data, 0, 23);
  if (!msgobj.valid) {
    logger.debug("invalid data: " + msgobj.str);
    return;
  }
  logger.debug("decoded data " + msgobj.str);
  // logger.debug("decoded data " + stringBuilder(data, 0, 23));

  let type = getRequestType(data, 20, 23);
  if (!type) {
    logger.debug("invalid msg type " + type);
    return;
  }

  let id = getDeviceId(data, 0, 19);
  logger.debug("id " + id, " type " + type);

  // TODO:
  // + Handle to reset token
  // + Handle cronjob (start and stop time)
  if (isDuplicated(id, type)) {
    logger.debug("Ignore this duplicated request");
    return;
  }

  if (type === 'X') {
    // cancel prev request
    cancelLastCustomerRequest(id, type);
  } else {
    // send POST for rest of msg
    sendCustomerRequest(id, type);
  }
});



// Read data that is available but keep the stream from entering "flowing mode"
/*port.on('readable', function () {
  logger.debug('[on-readable] Data: ' + port.read());
});*/
