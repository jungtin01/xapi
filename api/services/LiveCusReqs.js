const XCONFIG = require('./../../config/xconfig.js');

module.exports = {
  description : 'This is service to update realtime customer request',
  
  // TODO: update live customer request list whenver CustomerRequest CRUD is called
  // live customer request list
  current : {},

  // TODO: update this devices list whenver Xcaller CRUD is called
  // xcaller devices list
  devices: {},

  config: {
    autoclose: false, // if true, request will be closed automatically
    ttl: 0    // time to live (ms) for request, only use if autoclose is true
  },

  loadAutocloseConfig: function() {
    sails.log("Loading autoclose config...");
    
    ShopInfo.find({limit: 1}).exec(function(err, ashop) {
      if (err) { return sails.log("Could not get shopinfo from db " + err); }
      if (!ashop || ashop.length < 1) { return sails.log("No shopinfo available"); }
      LiveCusReqs.updateAutocloseConfig(ashop[0].requestTtl);
    });
  },

  updateAutocloseConfig: function(ttl) {
    // sails.log("ttl " + ttl);
    if (ttl > 0) {
      LiveCusReqs.config.ttl = ttl * 1000;
      LiveCusReqs.config.autoclose = true;
    } else {
      LiveCusReqs.config.ttl = 0;
      LiveCusReqs.config.autoclose = false;
    }
    sails.log("Updated config autoclose:", LiveCusReqs.config);
  },

  shouldAutocloseRequest: function(cusreq) {
    if (!LiveCusReqs.config.autoclose) {
      sails.log("Autoclose is disabled");
      return;
    }

    sails.log("Will close request " + cusreq.id + " in " + LiveCusReqs.config.ttl/1000 + " seconds");
    setTimeout(function () {
      LiveCusReqs.autocloseRequest(cusreq);
    }, LiveCusReqs.config.ttl);
  },

  autocloseRequest: function(cusreq) {
    sails.log("Autoclosing request " + cusreq.id);
    let requestStatus = 'C';
    let newClosedAt   = requestStatus === 'C' ? new Date() : cusreq.closedAt;
    CustomerRequest.update(
      { id: cusreq.id },
      { requestStatus: requestStatus,
        closedAt:   newClosedAt,
      }
    ).exec(function(err, updatedObj) {
      if (err) { return sails.log.error("Could not close request automatically", err); }
      if (updatedObj && updatedObj.length > 0) {
        // Update Live Customer Request
        let xcallerId = cusreq.table.xcallerId;

        // Check to update status for current Live Customer Request
        if (LiveCusReqs.current.hasOwnProperty(xcallerId)) {
          if (LiveCusReqs.current[xcallerId].id === cusreq.id) {
            // delete LiveCusReqs.current[xcallerId];
            LiveCusReqs.onDeleteLiveRequest(xcallerId, false); // dont notify on autoclose
            sails.log("Autoclosed request " + cusreq.id);
          }
        }

        // Log this update
        ActivitiesUtils.createActivityForReqStatusUpdate(updatedObj[0]);
      } else {
        return sails.log.error("No request is closed automatically, original request id " + cusreq.id);
      }
    });
  },

  updateOnlineUserAndOnlineProxies: function() {
    // TODO: when user ONLINE or OFFLINE, should we update this?
  },

  reportReq: function(updatedReq, shouldNotify) {
    // notif msg
    let msg = "Thông tin cập nhật yêu cầu";
    if (updatedReq.requestStatus === "N") {
      msg = "Có yêu cầu mới từ " + updatedReq.table.xcallerName;
    } else if (updatedReq.requestStatus === "R") {
      msg = "Yêu cầu đã được tiếp nhận";
    } else if (updatedReq.requestStatus === "C") {
      msg = "Đã hoàn thành yêu cầu cho khách"
    }

    // proxies list
    let proxies = [];
    for (let i = 0; i < updatedReq.proxies.length; i++) {
      proxies.push(updatedReq.proxies[i].username);
    }
    
    let tinyReq = { table:    updatedReq.table.xcallerName,
                    type:     updatedReq.requestType,
                    status:   updatedReq.requestStatus,
                    assignees:[updatedReq.owner.username], // TODO: should this is a list?
                    proxies:  proxies, // TODO: which should use with this proxies list
                    msg:      msg,
                    notify:   shouldNotify // TODO: handle this flag on dfk
                  };
    PublicServerUtils.customPost(XCONFIG.URLSTPCUSREQ, tinyReq);
  },

  onUpdateLiveRequest: function(xcallerId, updatedReq) {
    LiveCusReqs.current[xcallerId] = updatedReq;

    // TODO: do other tasks here, like notify to dfk server

    LiveCusReqs.reportReq(updatedReq, true);
  },

  onDeleteLiveRequest: function(xcallerId, shouldNotify) {
    let closedReq = undefined;
    if (LiveCusReqs.current.hasOwnProperty(xcallerId)) {
      closedReq = LiveCusReqs.current[xcallerId];
      delete LiveCusReqs.current[xcallerId];
    } else {
      sails.error.log("Could note delete live request for xcallerId " + xcallerId);
    }

    // TODO: do other tasks here, like notify to dfk server

    if (closedReq) {
      // console.log("closedReq: ", closedReq);
      closedReq.requestStatus = 'C';
      LiveCusReqs.reportReq(closedReq, shouldNotify);
    }
  },

  // TODO: live request must be updated every minute to remove timeout request (time >= 2 hrs)
  getLiveRequests: function(userinfo) {
    // input: userinfo is requesting person

    let liveRequests = [];
    let epochLastMinutes = Date.now() - 120*60*1000; // in millis

    for (let xcallerId in LiveCusReqs.current) {
      // sails.log("username livereq " + LiveCusReqs.current[xcallerId].owner.username + " vs userinfo " + userinfo.username);
      if (userinfo.role >= 5 || LiveCusReqs.current[xcallerId].owner.username === userinfo.username) {
        let createdAt = (new Date(LiveCusReqs.current[xcallerId].createdAt)).getTime();
        if (createdAt >= epochLastMinutes) {
          liveRequests.push(LiveCusReqs.current[xcallerId]);
        }
      }
    }

    return liveRequests;
  },

  getLatestRequests: function(responseData) {
    // precondition: responseData is sorted by id DESC
    
    // Get the latest requests for each xcaller device
    let arrXcallers = [];   // basically, these 2 arrays can be replaced by a dictionary such as dict[xcallerId] = request
    let latestReqs = [];    // however, it might not be pretty sure about the orders of each entry in the dictionary, so building 2 arrays should be used
    for (let i = 0; i < responseData.length; i++) {
      if (responseData[i].table !== undefined && arrXcallers.indexOf(responseData[i].table.xcallerId) < 0) {
        // sails.log("catching req with xcaller id ", responseData[i].table.xcallerId + " req id " + responseData[i].id);
        arrXcallers.push(responseData[i].table.xcallerId);
        latestReqs.push(responseData[i]);
      } else {
        // do nothing here
      }
    }
    return latestReqs;
  },

  // TODO: handle case 1
  // Create table A, B, C
  // Create new request 1, 2, 3 for table A, B, C
  // Remove table C?
  // Update table (xcaller name, xcaller id) of table A to another one? e.g: A1 ?

};
