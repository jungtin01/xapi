/**
 * TimesheetController
 *
 * @description :: Server-side logic for managing Timesheets
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  // createTimesheet: function(req, res) {
  //   //sails.log("Calling " + arguments.callee.name + " from " + __filename);
  //   return res.json(generateResultService.success({}));
  // },

  // updateTimesheet: function(req, res) {
  //   //sails.log("Calling " + arguments.callee.name + " from " + __filename);
  //   return res.json(generateResultService.success({}));
  // },

  // deleteTimesheet: function(req, res) {
  //   //sails.log("Calling " + arguments.callee.name + " from " + __filename);
  //   return res.json(generateResultService.success({}));
  // },

  getTimesheet: function(req, res) {
    //sails.log("Calling " + arguments.callee.name + " from " + __filename);

    if (_.isUndefined(req.params['id'])) {
      return res.badRequest(generateResultService.fail('id is required'));
    }

    Timesheet.findOne({ id: req.params['id'] }).populate('userId', {select: ['name']}).exec(function(err, timesheet) {
      if (err) { return res.serverError(err); }
      if (!timesheet) { return res.badRequest(generateResultService.fail('This timesheet is not exist')); }
      TimesheetUtils.formatTimesheet(timesheet);
      return res.json(generateResultService.success({ data: timesheet }));
    })
  },

  getAllTimesheets: function(req, res) {
    //sails.log("Calling " + arguments.callee.name + " from " + __filename);

    // Username
    let usernames = req.param('username');
    if (_.isUndefined(usernames)) {
      return res.badRequest(generateResultService.fail('username is required'));
    }
    let userIdList = UserUtils.validateUser({username: usernames});
    sails.log("userIdList " +  userIdList);
    if (userIdList.length === 0) {
      return res.badRequest(generateResultService.fail(usernames + ' username is invalid, please check'));
    }

    // Paging info
    let page = parseInt(req.param('page'));
    if (isNaN(page) || page < 1) {
      page = 1;
    }
    let pageSize = parseInt(req.param('size'));
    if (isNaN(pageSize) || pageSize < 0) {
      pageSize = 20;
    }
    sails.log("page " + page + " pageSize " + pageSize);

    // Filter info
    let fromInMills = Date.parse(req.param('from'));
    let toInMills = Date.parse(req.param('to'));
    sails.log("from " + req.param('from') + " to " + req.param('to'));

    if (isNaN(fromInMills)) {
      fromInMills = Date.now() - 30 * 24 * 3600 * 1000; // default to last month
    }
    if (isNaN(toInMills)) {
      toInMills = Date.now();
    }
    
    if (fromInMills > toInMills) {
      return res.badRequest(generateResultService.fail('`from` > `to`, please check'));
    }

    let ndays = parseInt((toInMills - fromInMills) / (24 * 3600 * 1000)) + 1;
    let fromDate = new Date(fromInMills);
    fromDate = Date.UTC(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate()); // shift to sod
    let toDate = new Date(toInMills);
    toDate = Date.UTC(toDate.getFullYear(), toDate.getMonth(), toDate.getDate(), 23, 59, 59); // shift to eod
    sails.log("from date " + fromDate);
    sails.log("to   date " + toDate);

    Timesheet.find({
      where: {
        datesod: {'>=' : fromDate, '<=' : toDate},
        userId: userIdList,
      },
      limit: pageSize, skip: pageSize*(page-1),
      sort: 'id DESC',
      // select: ['userId', 'datesod', 'inTime', 'outTime']
    }).populate('userId', {select: ['name']}).exec(function(err, responseData) {
      if (err) { return res.serverError(err); }
      if (!responseData) { return res.badRequest(generateResultService.fail('Could not find any timesheet records')); }

      TimesheetUtils.formatTimesheets(responseData);
      return res.json(
        generateResultService.success({
          totalDays: ndays,
          currentPageCount: responseData.length,
          data: responseData
        })
      );
    });
  },

};

