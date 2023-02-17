/**
 * CustomerRequestController
 *
 * @description :: Server-side logic for managing Customerrequests
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var _ = require('lodash');
let XcallerController = require('./XcallerController');

module.exports = {

  // TODO: implement asynchronous version for this creating new req method
  createRequest: function(req, res) {
    //sails.log("Calling " + arguments.callee.name + " from " + __filename);
    if (!_.isString(req.param('xcallerId'))) {
      return res.badRequest(generateResultService.fail('xcallerId must be string'));
    }
    if (!_.isString(req.param('requestType'))) {
      return res.badRequest(generateResultService.fail('requestType must be string'));
    }
    let xcallerId = req.param('xcallerId');

    // Check for adding new xcaller
    // sails.log("Allowed flag " + XcallerUtils.AllowedAddingXcaller);
    if (XcallerUtils.AllowedAddingXcaller) {
      sails.log("Try to add new xcaller id " + xcallerId);
      // generate device name
      let now = new Date();
      let nowstr = now.getTime().toString(); // convert epoch time to string
      let len = nowstr.length;
      req.body.xcallerName = nowstr.substring(len-3, len);
      return XcallerController.createXcaller(req, res);
    }

    // Handle duplication:
    // Rules:
    //  + ignore all msg within 5s from the last request of each xcaller
    //  + new request type must be different with previous one
    const duplicationThres = 5;
    if (!LiveCusReqs.current.hasOwnProperty(xcallerId)) {
      sails.log("No request for xcaller, creating new one for " + xcallerId);
      // create new req
    } else {
      let createdAt = LiveCusReqs.current[xcallerId].createdAt;
      let epochCreatedAt = (new Date(createdAt)).getTime(); // in millis
      let epochNow = Date.now(); // in millis
      sails.log("xcaller " + xcallerId + " createdAt " + epochCreatedAt + " vs now " + epochNow);
      if (epochCreatedAt + duplicationThres*1000 > epochNow) {
        // ignore this request
        return res.ok(generateResultService.fail('Do not accept new request within ' + duplicationThres + ' seconds'));
      } else {
        // allow creating new req
      }
    }

    // TODO: Update xcallers & users lists when they are changed

    // Checking xcallerId
    // sails.log("Checking xcallerId...");
    if (XcallerUtils.xcallersById.hasOwnProperty(xcallerId) === false) {
      return res.badRequest(generateResultService.fail('xcallerId is not exist: ' + xcallerId));
    }

    let device = XcallerUtils.xcallersById[xcallerId];
    sails.log("Creating new customer request for ", device);
    let pickedOwner = UserUtils.getOwner({assignees: device.assignees, default: req.token.id});
    let pickedProxies = (UserUtils.getPossibleProxies({owner: pickedOwner, assignees: device.assignees, default: req.token.id})).possibleProxies;
    CustomerRequest.create({
        table: device.id,
        requestType: req.param('requestType'),
        owner: pickedOwner,
        proxies: pickedProxies,
        requestStatus: 'N',
        // receivedAt: new Date(),
        // closedAt: new Date(),
      }).exec(async function(err, newreq) {
        if (err) { return res.json(err.status, { err: err }); }
        if (newreq) {
          // Send response
          res.json(generateResultService.success({ data: newreq }));
          
          // Modify fields `table`, `owner`, `proxies`
          // Construct new kind of request for storing
          // TODO: we have to manually creating this because newreq.proxies is not delete-able or changable
          let storedReq = JSON.parse(JSON.stringify(newreq)); // TODO: avoid using JSON.parse JSON.stringify heavily
          storedReq.table = {
            "xcallerName":  XcallerUtils.xcallers[newreq.table].xcallerName,
            "xcallerId":    XcallerUtils.xcallers[newreq.table].xcallerId
          };
          storedReq.owner = {
            "username":     UserUtils.users[newreq.owner].username,
            "name":         UserUtils.users[newreq.owner].name,
            "status":       UserUtils.users[newreq.owner].status,
            "isOnline":     UserUtils.users[newreq.owner].isOnline
          };
          // storedReq.proxies = UserUtils.getOnlineUsers();
          let tmpProxies = UserUtils.getOnlineUsers();
          for (let i = 0; i < tmpProxies.length; i++) {
            let proxy = {
              "username":   tmpProxies[i].username,
              "name":       tmpProxies[i].name,
              "status":     tmpProxies[i].status,
              "isOnline":   tmpProxies[i].isOnline
            }
            tmpProxies[i] = proxy;
          }
          storedReq.proxies = tmpProxies;

          // LiveCusReqs.current[device.xcallerId] = storedReq;
          LiveCusReqs.onUpdateLiveRequest(device.xcallerId, storedReq, true); // on create

          // Log this activity
          ActivitiesUtils.createActivityForNewReq(newreq); // TODO: improve this logging
        } else {
          return res.serverError("Could not create new customer request");
        }
      });
  },

  getUniqReqPerXcaller: async function(req, res) {
    // //sails.log("Calling " + arguments.callee.name + " from " + __filename);
    let userinfo = await UserUtils.getAuthenticatedUserInfo({userId: req.token.id}); // TODO: improve this performance by storing to a global structure
    let liveRequests = LiveCusReqs.getLiveRequests(userinfo);

    return res.json(
      generateResultService.success({
        total: liveRequests.length,
        data: liveRequests
      })
    );
  },
  
  getAllRequestsPage: function(req, res) {
    //sails.log("Calling " + arguments.callee.name + " from " + __filename);
    let page = parseInt(req.param('page'));
    // sails.log("page " + page);
    if (isNaN(page) || page < 1) {
      page = 1;
    }
    let pageSize = parseInt(req.param('size'));
    // sails.log("pageSize " + pageSize);
    if (isNaN(pageSize) || pageSize < 0) {
      pageSize = 20;
    }
    sails.log("page " + page + " pageSize " + pageSize);
    
    CustomerRequest.count().exec(function(err, total) {
      if (err) return res.negotiate(err);

      CustomerRequest.find({limit: pageSize, skip: pageSize*(page-1), sort: 'id DESC'})
      .populate('table', {select: ['xcallerName', 'xcallerId']})
      .populate('owner', {select: ['username', 'name', 'status', 'isOnline']})
      .populate('proxies', {select: ['username', 'name', 'status', 'isOnline']})
      .exec(function(err, responseData) {
        if (err) { return res.serverError(err); }
        
        return res.json(
          generateResultService.success({
            totalCount: total,
            currentPageCount: responseData.length,
            data: responseData,
          })
        );
      });
    });
  },

  getRequestsFromRequestId: async function(req, res) {
    //sails.log("Calling " + arguments.callee.name + " from " + __filename);
    let requestId = parseInt(req.param('requestid'));
    if (isNaN(requestId) || requestId <= 0) {
      return res.badRequest(generateResultService.fail('requestid is invalid'));
    }

    let userinfo = await UserUtils.getAuthenticatedUserInfo({userId: req.token.id});
    sails.log("getRequestsFromRequestId userinfo ", userinfo);

    let cusReq;
    if (userinfo.role >= 5) {
      cusReq = await CustomerRequest.find({
        where: {
          id: {'>=' : requestId},
        },
        sort: 'id DESC'
      })
      .populate('table', {select: ['xcallerName', 'xcallerId']})
      .populate('owner', {select: ['username', 'name', 'status', 'isOnline']})
      .populate('proxies', {select: ['username', 'name', 'status', 'isOnline']});
    } else {
      cusReq = await CustomerRequest.find({
        where: {
          id: {'>=' : requestId},
          owner: req.token.id,
        },
        sort: 'id DESC'
      })
      .populate('table', {select: ['xcallerName', 'xcallerId']})
      .populate('owner', {select: ['username', 'name', 'status', 'isOnline']})
      .populate('proxies', {select: ['username', 'name', 'status', 'isOnline']});
    }

    if (!cusReq) { return res.badRequest(generateResultService.fail('Problem may occur due to requestid')); }

    return res.json(
      generateResultService.success({
        total: cusReq.length,
        data: cusReq
      })
    );
  },

  getRequest: async function(req, res) {
    //sails.log("Calling " + arguments.callee.name + " from " + __filename);
    if (_.isUndefined(req.params['id'])) {
      return res.badRequest(generateResultService.fail('id is required'));
    }
    let requestId = parseInt(req.param('id'));
    sails.log("requesting for customer req id and requestId ", requestId);
    if (isNaN(requestId) || requestId <= 0) {
      return res.badRequest(generateResultService.fail('id is invalid'));
    }

    let userinfo = await UserUtils.getAuthenticatedUserInfo({userId: req.token.id});
    // sails.log("getRequest userinfo ", userinfo.username);
    
    let cusReq;
    if (userinfo.role >= 5) {
      cusReq = await CustomerRequest.findOne({
        where: {
          id: requestId,
        }
      })
      .populate('table', {select: ['xcallerName', 'xcallerId']})
      .populate('owner', {select: ['username', 'name', 'status', 'isOnline']})
      .populate('proxies', {select: ['username', 'name', 'status', 'isOnline']});
    } else {
      cusReq = await CustomerRequest.findOne({
        where: {
          id: requestId,
          owner: req.token.id,
        }
      })
      .populate('table', {select: ['xcallerName', 'xcallerId']})
      .populate('owner', {select: ['username', 'name', 'status', 'isOnline']})
      .populate('proxies', {select: ['username', 'name', 'status', 'isOnline']})
    }

    if (!cusReq) { return res.badRequest(generateResultService.fail('This customer request is not exist')); }
    return res.json(generateResultService.success({ data: cusReq }));
  },

  deleteRequest: function(req, res) {
    //sails.log("Calling " + arguments.callee.name + " from " + __filename);
    if (_.isUndefined(req.params['id'])) {
      return res.badRequest(generateResultService.fail('id is required'));
    }

    CustomerRequest.findOne({ id: req.param('id') }).populate('table', {select: ['id', 'xcallerId']}).exec(function(err, cusReq) {
      if (err) { return res.serverError(err); }
      if (!cusReq) { return res.badRequest(generateResultService.fail('This customer request is not exist')); }
      let xcallerId = cusReq.table.xcallerId;

      CustomerRequest.destroy({ id: cusReq.id }).exec(function(err) {
        if (err) { return res.serverError(err); }
        res.json(generateResultService.success({ data: [] }));

        // When Agent posts request to Update/Delete customer request,
        // it will send xcallerId instead of customer request id because it only knows xcallerId
        // Update Live Customer Request
        if (LiveCusReqs.current.hasOwnProperty(xcallerId)) {
          if (cusReq.id === LiveCusReqs.current[xcallerId].id) {
            // delete LiveCusReqs.current[xcallerId];
            LiveCusReqs.onDeleteLiveRequest(xcallerId, false); // dont notify on admin deleted req
            sails.log("DEL: req of " + xcallerId);
          }
        }

        // Log this deletion
        ActivitiesUtils.createActivityForReqDeletion(cusReq);
      });
    });
  },

  closeLastRequest: function(req, res) {
    //sails.log("Calling " + arguments.callee.name + " from " + __filename);
    let xcallerId = req.params['xcallerId'];
    if (_.isUndefined(xcallerId)) {
      return res.badRequest(generateResultService.fail('xcallerId is required'));
    }

    // When Agent posts request to Update/Delete customer request,
    // it will send xcallerId instead of customer request id because it only knows xcallerId
    // Update Live Customer Request
    if (!LiveCusReqs.current.hasOwnProperty(xcallerId)) {
      return res.badRequest(generateResultService.fail("xcallerId " + xcallerId + " does not have live request, ignore msg"));
    }

    let wantedId = LiveCusReqs.current[xcallerId].id;
    CustomerRequest.findOne({ id: wantedId }).populate('table', {select: ['id', 'xcallerId']}).exec(function(err, cusReq) {
      if (err) { return res.serverError(err); }
      if (!cusReq) { return res.badRequest(generateResultService.fail('This customer request is not exist')); }

      sails.log("Closing the request " + wantedId + " of "+ xcallerId);
      let status = 'C';
      CustomerRequest.update(
        { id: wantedId },
        { requestStatus: status,
          receivedAt: status == 'R' ? new Date() : cusReq.receivedAt,
          closedAt:   status == 'C' ? new Date() : cusReq.closedAt,
        }
      ).exec(function(err, updatedObj) {
        if (err) { return res.json(err.status, { err: err }); }
        sails.log("Total closed CustomerRequest ", updatedObj.length);
        if (updatedObj) {
          res.json(generateResultService.success({ total: updatedObj.length, data: updatedObj }));

          if (updatedObj.length > 0) {
            // Update Live Customer Request
            if (LiveCusReqs.current.hasOwnProperty(xcallerId)) {
              if (LiveCusReqs.current[xcallerId].id === updatedObj[0].id) {
                // delete LiveCusReqs.current[xcallerId];
                LiveCusReqs.onDeleteLiveRequest(xcallerId, true); // on close
                sails.log("CLOSE REQUEST: for " + xcallerId);
              }
            }

            // Log this update
            ActivitiesUtils.createActivityForReqStatusUpdate(updatedObj[0]);
          }
        } else {
          return res.serverError("Could not update customer request"); // TODO: apply this fix for all other controller
        }
      });
    });
  },

  updateRequestStatus: async function(req, res) {
    //sails.log("Calling " + arguments.callee.name + " from " + __filename);
    if (_.isUndefined(req.params['id'])) {
      return res.badRequest(generateResultService.fail('id is required'));
    }
    let requestStatus = req.param('requestStatus');
    if (!_.isString(requestStatus)) {
      return res.badRequest(generateResultService.fail('requestStatus is required'));
    }
    if (requestStatus != 'R' && requestStatus != 'C') {
      return res.badRequest(generateResultService.fail('requestStatus is invalid'))
    }
    let userinfo = await UserUtils.getAuthenticatedUserInfo({userId: req.token.id}); // TODO: improve this performance by storing to a global structure
    sails.log("updateRequestStatus userinfo ", userinfo.username);
    
    let foundReq;
    if (userinfo.role >= 5) {
      foundReq = await CustomerRequest.findOne({ where: { id: req.params['id'] }}).populate('table', {select: ['id', 'xcallerId']});
    } else {
      foundReq = await CustomerRequest.findOne({ where: { id: req.params['id'], owner: req.token.id }}).populate('table', {select: ['id', 'xcallerId']});
    }
    if (!foundReq) { return res.badRequest(generateResultService.fail('This customer request does not exist or permission denied')); }
    let xcallerId = foundReq.table.xcallerId;
    // let userOwner = foundReq.owner;
    // sails.log("userOwner", userOwner);

    sails.log("updating status of CustomerRequest " + foundReq.id + " to "+ requestStatus);
    let newReceivedAt = requestStatus == 'R' ? new Date() : foundReq.receivedAt;
    let newClosedAt   = requestStatus == 'C' ? new Date() : foundReq.closedAt;
    CustomerRequest.update(
      { id: foundReq.id },
      { requestStatus: requestStatus,
        receivedAt: newReceivedAt,
        closedAt:   newClosedAt,
      }
    ).exec(function(err, updatedObj) {
      if (err) { return res.json(err.status, { err: err }); }
      if (updatedObj) {
        res.json(generateResultService.success({ total: updatedObj.length, data: updatedObj }));
        // sails.log("total updated CustomerRequest ", updatedObj.length);

        if (updatedObj.length > 0) {
          // Update Live Customer Request
          CustomerRequest.findOne({ id: updatedObj[0].id })
          .populate('table', {select: ['xcallerName', 'xcallerId']})
          .populate('owner', {select: ['username', 'name', 'status', 'isOnline']})
          .populate('proxies', {select: ['username', 'name', 'status', 'isOnline']})
          .exec(async function(err, foundNewReq) {
            // Check to update status for current Live Customer Request
            if (LiveCusReqs.current.hasOwnProperty(xcallerId)) {
              if (LiveCusReqs.current[xcallerId].id === foundNewReq.id) {
                if (requestStatus == 'C') {
                  // delete LiveCusReqs.current[xcallerId];
                  LiveCusReqs.onDeleteLiveRequest(xcallerId, true); // on update with status Closed
                } else {
                  // LiveCusReqs.current[xcallerId] = foundNewReq;
                  LiveCusReqs.onUpdateLiveRequest(xcallerId, foundNewReq, true); // on update
                }
                sails.log("UPDATE STATUS for request " + foundNewReq.id + " to " + requestStatus);
              }
            }
            if (requestStatus == 'R') LiveCusReqs.shouldAutocloseRequest(foundNewReq);
          });

          // Log this update
          ActivitiesUtils.createActivityForReqStatusUpdate(updatedObj[0]);
        }
      } else {
        return res.serverError("Could not update customer request"); // TODO: apply this fix for all other controller
      }
    });
  },

  updateAssignee: function(req, res) {
    //sails.log("Calling " + arguments.callee.name + " from " + __filename);
    if (_.isUndefined(req.params['id'])) {
      return res.badRequest(generateResultService.fail('id is required'));
    }
    if (!_.isString(req.param('username'))) {
      return res.badRequest(generateResultService.fail('username is required'));
    } 

    User.findOne({username: req.param('username')}).exec(function(err, foundUser) {
      if (err) { return res.serverError(err); }
      if (!foundUser) { return res.badRequest(generateResultService.fail('This username is not exist')); }

      CustomerRequest.findOne({ id: req.params['id'] }).populate('table', {select: ['id', 'xcallerId']}).exec(function(err, foundReq) {
        if (err) { return res.serverError(err); }
        if (!foundReq) { return res.badRequest(generateResultService.fail('This customer request does not exist')); }
        let xcallerId = foundReq.table.xcallerId;
        
        sails.log("updating assignee for CustomerRequest from " + foundReq.id + " to " + foundUser.username);
        CustomerRequest.update({ id: foundReq.id }, { owner: foundUser.id }).exec(function(err, updatedObj) {
          if (err) { return res.json(err.status, { err: err }); }
          sails.log("total updated CustomerRequest ", updatedObj.length);
          if (updatedObj) {
            res.json(generateResultService.success({ total: updatedObj.length, data: updatedObj }));

            if (updatedObj.length > 0) {
              // Update Live Customer Request
              CustomerRequest.findOne({ id: updatedObj[0].id })
              .populate('table', {select: ['xcallerName', 'xcallerId']})
              .populate('owner', {select: ['username', 'name', 'status', 'isOnline']})
              .populate('proxies', {select: ['username', 'name', 'status', 'isOnline']})
              .exec(async function(err, foundNewReq) {
                // Check to update owner for current Live Customer Request
                if (LiveCusReqs.current.hasOwnProperty(xcallerId)) {
                  if (LiveCusReqs.current[xcallerId].id === foundNewReq.id) {
                    // LiveCusReqs.current[xcallerId] = foundNewReq;
                    LiveCusReqs.onUpdateLiveRequest(xcallerId, foundNewReq, true); // on change assignee
                    sails.log("UPDATE OWNER for request " + foundNewReq.id);
                  }
                }
              });

              // Log this update
              ActivitiesUtils.createActivityForAssigneeUpdate(updatedObj[0]);
            }
          } else {
            return res.serverError("Could not update customer request"); // TODO: apply this fix for all other controller
          }
        });
      });
    });
  },

};
