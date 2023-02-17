/**
 * ActivitiesLoggingController
 *
 * @description :: Server-side logic for managing Activitiesloggings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  
  getActivities: function(req, res) {
    //sails.log("Calling " + arguments.callee.name + " from " + __filename);

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
      fromInMills = Date.now() - 24 * 3600 * 1000;
    }
    if (isNaN(toInMills)) {
      toInMills = Date.now();
    }
    
    if (fromInMills > toInMills) {
      return res.badRequest(generateResultService.fail('`from` > `to`, please check'));
    }

    // let ndays = parseInt((toInMills - fromInMills) / (24 * 3600 * 1000));
    let fromDate = new Date(fromInMills);
    fromDate = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate(), 0, 0, 0); // shift to sod
    let toDate = new Date(toInMills);
    toDate = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate(), 23, 59, 59); // shift to eod
    sails.log("from date " + fromDate);
    sails.log("to   date " + toDate);

    // TODO: condition to count all items?
    ActivitiesLogging.count({
      where: {
        createdAt: {'>=' : fromDate, '<=' : toDate},
      },
    }).exec(function(err, total) {
      if (err) return res.negotiate(err);

      // TODO: reduce information in responded data
      ActivitiesLogging.find({
        where: {
          createdAt: {'>=' : fromDate, '<=' : toDate},
        },
        limit: pageSize, skip: pageSize*(page-1),
        sort: 'id DESC',
        // select: ['requestTime', 'requestId', 'requestType', 'waitingTimeInSeconds', 'table', 'owner'] // this selection causes responded data only fetch for the first item only --> find solution for this
      })
      .populate('table', {select: ['xcallerName']})
      .populate('owner', {select: ['username', 'name']})
      .exec(function(err, responseData) {
        // .populate('partner', { select: ['_id', 'name', 'avatar']})
        if (err) { return res.serverError(err); }
        return res.json(
          generateResultService.success({
            totalCount: total,
            currentPageCount: responseData.length,
            data: responseData
          })
        );
      });
    });
  },

};

