/**
 * StatisticsDayController
 *
 * @description :: Server-side logic for managing Statisticsdays
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var _ = require('lodash');

module.exports = {

  getStatisticsByDay: function(req, res) {
    //sails.log("Calling " + arguments.callee.name + " from " + __filename);
    let fromInMills = Date.parse(req.param('from'));
    let toInMills = Date.parse(req.param('to'));
    sails.log("from " + req.param('from') + " to " + req.param('to'));
    if (isNaN(fromInMills) || isNaN(toInMills)) {
      return res.badRequest(generateResultService.fail('invalid format of `from` or `to` date'));
    }
    
    if (fromInMills > toInMills) {
      return res.badRequest(generateResultService.fail('`from` > `to`, please check'));
    }

    // let ndays = parseInt((toInMills - fromInMills) / (24 * 3600 * 1000));
    let ndays = parseInt((toInMills - fromInMills) / (24 * 3600 * 1000)) + 1;
    let fromDate = new Date(fromInMills);
    fromDate = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate(), 0, 0, 0); // shift to sod
    let toDate = new Date(toInMills);
    toDate = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate(), 23, 59, 59); // shift to eod
    sails.log("from date " + fromDate);
    sails.log("to   date " + toDate);

    StatisticsDay.find({
      where: {
        date: {'>=' : fromDate, '<=' : toDate},
      },
      // sort: 'date ASC',
      select: ['date', 'avgWaitingTimeInSeconds', 'totalRequests', 'validReceivedRequests']
    }).exec(function(err, responseData) {
      if (err) { return res.serverError(err); }
      if (!responseData) { return res.badRequest(generateResultService.fail('Could not find any StatisticsDay records')); }

      let sum = 0;
      for (let item of responseData) {
        sum += item.avgWaitingTimeInSeconds;
      }

      return res.json(
        generateResultService.success({
          totalDays: ndays,
          totalRecords: responseData.length,
          avgWaitingTimeInSeconds: _.toInteger(sum / responseData.length),
          data: responseData
        })
      );
    });
  },

};

