var _ = require('lodash');

module.exports = {

  createActivityForNewReq: function(newreq) {
    // newreq: new created customer request
    sails.log("logging newreq info " + newreq.table + " owner " + newreq.owner);
    ActivitiesLogging.create({
      requestTime:  newreq.createdAt,
      requestId:    newreq.id,
      table:        newreq.table,
      owner:        newreq.owner,
      requestType:  newreq.requestType,
      description:  'Yeu cau moi',
      waitingTimeInSeconds: 0, // TODO: update this delay later
    }).exec(function (err, newlog) {
      if (err) {
        sails.log("Could not create logging for new customer request " + newreq.id);
      }
    });
  },

  createActivityForReqDeletion: function(deletedReq) {
    // deletedReq: request has been deleted
    sails.log("logging deleted request " + deletedReq.id);
    ActivitiesLogging.create({
      requestTime:  new Date(),
      requestId:    deletedReq.id,
      table:        deletedReq.table,
      owner:        deletedReq.owner,
      requestType:  deletedReq.requestType,
      description:  'Xoa yeu cau',
      waitingTimeInSeconds: deletedReq.waitingTimeInSeconds,
    }).exec(function (err, newlog) {
      if (err) {
        sails.log("Could not create logging for deleting customer request " + deletedReq.id + ' err ' + err);
      }
    });
  },

  createActivityForReqStatusUpdate: function(updatedReq) {
    // updatedReq: request has been updated
    sails.log("logging updated request status for " + updatedReq.id);
    ActivitiesLogging.create({
      requestTime:  new Date(),
      requestId:    updatedReq.id,
      table:        updatedReq.table,
      owner:        updatedReq.owner,
      requestType:  updatedReq.requestType,
      description:  'Cap nhat trang thai',
      waitingTimeInSeconds: updatedReq.requestStatus == 'R' ? _.toInteger((updatedReq.receivedAt - updatedReq.createdAt)/1000) : updatedReq.waitingTimeInSeconds,
    }).exec(function (err, newlog) {
      if (err) {
        sails.log("Could not create log for updating status of customer request " + updatedReq.id + " err " + err);
      }
    });
  },

  createActivityForAssigneeUpdate: function(updatedReq) {
    // updatedReq: request has been deleted
    sails.log("logging updated assignee for " + updatedReq.id);
    ActivitiesLogging.create({
      requestTime:  new Date(),
      requestId:    updatedReq.id,
      table:        updatedReq.table,
      owner:        updatedReq.owner,
      requestType:  updatedReq.requestType,
      description:  'Doi nhan vien phu trach',
      waitingTimeInSeconds: updatedReq.waitingTimeInSeconds
    }).exec(function (err, newlog) {
      if (err) {
        sails.log("Could not create log for updating assignee of customer request " + updatedReq.id + " err " + err);
      }
    });
  },

};