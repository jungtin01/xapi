let request = require('request');
let base64 = require('base-64');
let publicIp = require('public-ip');
const XCONFIG = require('./../../config/xconfig.js');

module.exports = {

  // TODO: always check flag `ready` before using this token
  SyncUserToken: { token: '', time: '', ready : false},

  doRequestSync: function(url, forms) {
    return new Promise(function (resolve, reject) {
      request(url, forms, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          resolve(body);
        } else {
          reject(error);
        }
      });
    });
  },

  reconnectToPublicServer: function(ms, maxRetries) {
    if (maxRetries <= 0) return;
    sails.log("Will reconnect in " + ms/1000 + "s (" + maxRetries + " times left)");
    setTimeout(function () {
      PublicServerUtils.getTokenToPulicServer(maxRetries-1);
    }, ms);
  },

  getTokenToPulicServer: function(maxRetries) {
    sails.log("Connecting server...");
    
    // TODO: there is only one shop, shop store it in global,
    // dont need to query db everytime
    ShopInfo.find({limit: 1}).exec(function(err, ashop) {
      if (err) {
        sails.log("Could not get shopinfo, stop connecting to server, err " + err);
        return PublicServerUtils.reconnectToPublicServer(2 * 60 * 1000, maxRetries);
      }
      if (!ashop || ashop.length < 1) {
        // try reconnecting if account available
        sails.log("No sync account available");
        return PublicServerUtils.reconnectToPublicServer(2 * 60 * 1000, maxRetries);
      }
      PublicServerUtils.renewTokenToPublicServer({suser: ashop[0].suser, spwd: base64.decode(ashop[0].spwd)});
    });
  },

  // options: {suser: username-value, spwd: plain-text-password-of-username}
  renewTokenToPublicServer: function(options) {
    sails.log("Authenticating to public server...");
    PublicServerUtils.SyncUserToken.ready = false;
    request.post(XCONFIG.URLLOGIN, {form: {username: options.suser, password: options.spwd}},
      function (error, response, body) {
        if (error) {
          sails.log(arguments.callee.name + " err:" + error);
          return PublicServerUtils.reconnectToPublicServer(2 * 60 * 1000, 1);
        }
        if (response.statusCode !== 200) {
          sails.log(arguments.callee.name + " Unexpected status code: " + response.statusCode);
          return PublicServerUtils.reconnectToPublicServer(2 * 60 * 1000, 1);
        }

        body = JSON.parse(body); // TODO: try catch for all JSON.parse() JSON.string(): apply for all local, public, xrobot, .... scripts
        if (!body.status) {
          sails.log(arguments.callee.name + " Could not parse body into json obj");
          return PublicServerUtils.reconnectToPublicServer(2 * 60 * 1000, 1);
        } else if (body.status !== "success") {
          sails.log(arguments.callee.name + " Request is failed:" + body);
          return PublicServerUtils.reconnectToPublicServer(2 * 60 * 1000, 1);
        }

        PublicServerUtils.SyncUserToken.token = body.result.token;
        PublicServerUtils.SyncUserToken.time = Date.now();
        PublicServerUtils.SyncUserToken.ready = true;
        sails.log("New token " + PublicServerUtils.SyncUserToken.token);

        // Generate stp token and send back to public server
        PublicServerUtils.sendStpToken();

        // Send daily stat on reconnect
        StpStatsUtils.dailyStatsSync();
        return;
      });
  },

  sendStpToken: async function() {
    if (!PublicServerUtils.SyncUserToken.ready) { sails.log("Token is not ready"); return; }

    let myip = await publicIp.v4();
    let stptoken = jwToken.issue({ id: UserUtils.findUser("stp") });
    sails.log("Sending stp token from myip " + myip);
    request.post(XCONFIG.URLSTPTOKEN, {'auth': { 'bearer': PublicServerUtils.SyncUserToken.token }, form: {stptoken: stptoken, port: sails.config.port, ip: myip}},
      function (error, response, body) {
        if (error) {
          sails.log(arguments.callee.name + " err:" + error);
          return;
        }
        if (response.statusCode !== 200) {
          sails.log(arguments.callee.name + " Unexpected status code: " + response.statusCode);
          return;
        }

        body = JSON.parse(body);
        if (!body.status) {
          sails.log(arguments.callee.name + " Could not parse body into json obj");
          return;
        } else if (body.status !== "success") {
          sails.log(arguments.callee.name + " Request is failed:" + body);
          return;
        }

        sails.log("Sent stp token. Response from server: ", body);
      });
  },

  getMyProfile: function() {
    sails.log("Getting my profile...");
    if (!PublicServerUtils.SyncUserToken.ready) { sails.log("Token is not ready"); return; }

    request.get(XCONFIG.URLMYPROFILE, {'auth': { 'bearer': PublicServerUtils.SyncUserToken.token }},
      function (error, response, body) {
        if (error) {
          sails.log(arguments.callee.name + " err:" + error);
          return;
        }
        if (response.statusCode !== 200) {
          sails.log(arguments.callee.name + " Unexpected status code: " + response.statusCode);
          return;
        }

        body = JSON.parse(body);
        if (!body.status) {
          sails.log(arguments.callee.name + " Could not parse body into json obj");
          return;
        } else if (body.status !== "success") {
          sails.log(arguments.callee.name + " Request is failed: " + body);
          return;
        }

        sails.log("Got my profile: " + JSON.stringify(body.result));
        return;
      });
  },

  getMyProfileSync: async function() {
    sails.log("Getting my profile...");
    if (!PublicServerUtils.SyncUserToken.ready) { sails.log("Token is not ready"); return; }

    let response = await PublicServerUtils.doRequestSync(XCONFIG.URLMYPROFILE, {'auth': { 'bearer': PublicServerUtils.SyncUserToken.token }});
    let body = JSON.parse(response);
    if (!body.status) {
      sails.log(arguments.callee.name + " Could not parse body into json obj");
      return;
    } else if (body.status !== "success") {
      sails.log(arguments.callee.name + " Request is failed:" + body);
      return;
    }

    sails.log("Got my profile: " + JSON.stringify(body.result));
  },

  customPost: function(url, jsonform) {
    console.log("Sending req to ", url, " form: ", jsonform);
    return new Promise(function (resolve, reject) {
      if (!PublicServerUtils.SyncUserToken.ready) {
        sails.log("Token is not ready");
        return reject("Token is not ready");
      }

      request.post(url, {'auth': { 'bearer': PublicServerUtils.SyncUserToken.token }, form: jsonform},
        function (error, response, body) {
          if (error) { 
            sails.log.error("Error on POST-ing: ", error);
            return reject(error);
          }
          if (response.statusCode !== 200) {
            sails.log.error("Unexpected status code: " + response.statusCode + ", Body: " + body);
            return reject("Unexpected status code: " + response.statusCode + ", Body: " + body);
          }

          // app specific data handling
          sails.log("Sent request successfully. Response from server: " + body);
          try {
            let jsonbody = JSON.parse(body);
            if (!jsonbody.status) {
              sails.log.error("Could not parse body into json obj: " + body);
              return reject("Could not parse body into json obj: " + body);
            } else if (jsonbody.status !== "success") {
              sails.log.error("Request is failed:" + body);
              return reject("Request is failed:" + body);
            }

            return resolve(jsonbody);
          } catch (e) {
            sails.log.error("JSON parse error: " + e);
            return reject("JSON parse error: " + e);
          }
        });
    });
  },

  sendNewShopInfo: function(shopinfo) {
    // TODO: consider if a shop user can have multiple shops
    sails.log("Sending to create shopinfo");
    if (!PublicServerUtils.SyncUserToken.ready) { sails.log("Token is not ready"); return; }
    if (!shopinfo) { return sails.log("Shopinfo is invalid: " + shopinfo); }

    // Safely delete unwanted account to STP
    delete shopinfo.spwd;
    delete shopinfo.suser;

    request.post(XCONFIG.URLSTPMYSHOPINFO, {'auth': { 'bearer': PublicServerUtils.SyncUserToken.token }, form: shopinfo},
      function (error, response, body) {
        // standard request method handling // response: json Object, body: string
        if (error) { return sails.log.error("err:" + error); }
        if (response.statusCode !== 200) {
          return sails.log.error("Unexpected status code: " + response.statusCode + ", Body: " + body);
        }

        // app specific data handling
        sails.log("Sent shopinfo successfully. Response from server: " + body);
        try {
          body = JSON.parse(body);
          if (!body.status) {
            return sails.log.error("Could not parse body into json obj: " + body);
          } else if (body.status !== "success") {
            return sails.log.error("Request is failed:" + body);
          }

          // Update to DB
          if (shopinfo.id) StpStatsUtils.updateStpStats({shopinfoLastId: shopinfo.id});
        } catch (e) {
          return sails.log.error("JSON parse error: " + e);
        }
      });
  },

  sendUpdatedShopInfo: function(shopinfo) {
    sails.log("Sending to update shopinfo");
    if (!PublicServerUtils.SyncUserToken.ready) { sails.log("Token is not ready"); return; }
    if (!shopinfo) { return sails.log("Shopinfo is invalid: " + shopinfo); }

    // Safely delete unwanted account to STP
    delete shopinfo.spwd;
    delete shopinfo.suser;

    request.put(XCONFIG.URLSTPMYSHOPINFO, {'auth': { 'bearer': PublicServerUtils.SyncUserToken.token }, form: shopinfo},
      function (error, response, body) {
        // standard request method handling // response: json Object, body: string
        if (error) { return sails.log.error("err:" + error); }
        if (response.statusCode !== 200) {
          return sails.log.error("Unexpected status code: " + response.statusCode + ", Body: " + body);
        }

        // app specific data handling
        sails.log("Sent Updated shopinfo successfully. Response from server: " + body);
        try {
          body = JSON.parse(body);
          if (!body.status) {
            return sails.log.error("Could not parse body into json obj: " + body);
          } else if (body.status !== "success") {
            return sails.log.error("Request is failed:" + body);
          }


          // Update to DB
          if (shopinfo.id !== StpStatsUtils.data.shopinfoLastId) {
            StpStatsUtils.updateStpStats({shopinfoLastId: shopinfo.id});
          }
        } catch (e) {
          return sails.log.error("JSON parse error: " + e);
        }
      });
  },

};
