var _ = require('lodash');
const XCONFIG = require('./xconfig.js');

// schedule format: ['seconds', 'minutes', 'hours', 'dayOfMonth', 'month', 'dayOfWeek']
module.exports.cron = {
  createStatisticsHourly: {
    timezone: 'Asia/Ho_Chi_Minh',
    schedule: '0 0 * * * *', // run every hour at first minute
    // schedule: '*/20 * * * * *', // run every 20s
    onTick: function () {
      let now = Date.now();
      let allowedDelay = 3 * 1000; // 3 seconds delayed
      // let lastDay = new Date(now - 0 * 3600 * 1000 + allowedDelay - 1 * 60 * 1000);
      let lastDay = new Date(now - 24 * 3600 * 1000 + allowedDelay);
      let lastHour = new Date(now - 1 * 3600 * 1000 + allowedDelay);
      sails.log('Checking and creating statistics records for last day ' + lastDay);
      sails.log('Checking and creating statistics records for last hour ' + lastHour);

      StatisticsDay.find({
        where: {
          createdAt: {'>=' : lastDay},
        },
      }).exec(function(err, foundRecords) {
        if (err) { return sails.log.error("Error on getting statistics records:", err); }
        if (!foundRecords) { return sails.log.error("Could not find any statistics records"); }
        if (foundRecords.length > 0) {
          sails.log.info("Found " + foundRecords.length + " daily statistics record(s), stop creating yesterday record " + lastDay);
          sails.log.info("First found record id " + foundRecords[0].id);
        } else {
          CustomerRequest.find({
            where: {
              createdAt: {'>=' : lastDay},
              requestStatus : ['R', 'C']
            },
            sort: 'id',
            select: ['id', 'requestStatus', 'createdAt', 'receivedAt'],
          })
          .exec(function(err, responseData) {
            if (err) { return sails.log.error("Error on getting customer requests recrods:", err); }
            if (!responseData) { return sails.log.error("Could not find any customer requests records"); }

            sails.log("Compute daily statistics: total records " + responseData.length);
            if (responseData.length > 0) {
              sails.log("Compute daily statistics: id from " + responseData[0].id);
              sails.log("Compute daily statistics: id to   " + responseData[responseData.length-1].id);
            }

            let delay = 0, count = 0;
            for (let i in responseData) {
              if (responseData[i].receivedAt !== null && !_.isUndefined(responseData[i].receivedAt)) {
                delay += (responseData[i].receivedAt - responseData[i].createdAt) / 1000;
                count += 1;
                sails.log("record " + responseData[i].id + " " + responseData[i].receivedAt + " " + responseData[i].createdAt + " current delay " + delay);
              }
            }

            StatisticsDay.create({
              date: lastDay,
              avgWaitingTimeInSeconds: count == 0 ? 0 : _.toInteger(delay / responseData.length),
              validReceivedRequests: count,
              totalRequests: responseData.length,
            }).exec(function (err, newStatistic) {
              // TODO: check error and post statistic to public server
            });
          });
        }
      });

      StatisticsHour.find({
        where: {
          createdAt: {'>=' : lastHour},
        },
      }).exec(function(err, foundRecords) {
        if (err) { return sails.log.error("Error on getting statistics records:", err); }
        if (!foundRecords) { return sails.log.error("Could not find any statistics records"); }
        if (foundRecords.length > 0) {
          sails.log.info("Found " + foundRecords.length + " hourly statistics record(s), stop creating last hour record " + lastHour);
          sails.log.info("First found record id of last hour " + foundRecords[0].id);
        } else {
          CustomerRequest.find({
            where: {
              createdAt: {'>=' : lastHour},
              requestStatus : ['R', 'C']
            },
            sort: 'id',
            select: ['id', 'requestStatus', 'createdAt', 'receivedAt'],
          })
          .exec(function(err, responseData) {
            if (err) { return sails.log.error("Error on getting customer requests recrods:", err); }
            if (!responseData) { return sails.log.error("Could not find any customer requests records"); }

            sails.log("Compute hourly statistics: total records " + responseData.length);
            if (responseData.length > 0) {
              sails.log("Compute hourly statistics: id from " + responseData[0].id);
              sails.log("Compute hourly statistics: id to   " + responseData[responseData.length-1].id);
            }

            let delay = 0, count = 0;
            for (let i in responseData) {
              if (responseData[i].receivedAt !== null && !_.isUndefined(responseData[i].receivedAt)) {
                delay += (responseData[i].receivedAt - responseData[i].createdAt) / 1000;
                count += 1;
                sails.log("hourly record " + responseData[i].id + " " + responseData[i].receivedAt + " " + responseData[i].createdAt + " current delay " + delay);
              }
            }

            StatisticsHour.create({
              date: lastHour,
              avgWaitingTimeInSeconds: count == 0 ? 0 : _.toInteger(delay / responseData.length),
              validReceivedRequests: count,
              totalRequests: responseData.length,
            }).exec(function (err, newStatistic) {});
          });
        }
      })

    }
  },

  // Check current status of user periodically
  // detectUserCurrentStatus: {
    // timezone: 'Asia/Ho_Chi_Minh',
    // schedule: '19 * * * * *',
    // onTick: function () {
      // let now = Date.now();
      // let OFFLINE_THRESH = 5 * 60 * 1000; // 30 minutes, TODO: move this into configuration file
      // // let OFFLINE_THRESH = 30 * 60 * 1000; // 30 minutes, TODO: move this into configuration file
      // sails.log("Checking user statuses...");
      // UserUtils.checkUserCurrentStatus({offlineThresh: new Date(now - OFFLINE_THRESH)});
    // }
  // },

  //========================
  // STP
  //========================
  // Connect public server
  connectPublicServer: {
    timezone: 'Asia/Ho_Chi_Minh',
    // schedule: '0 */1 * * * *', // run every 2 mins at second 0-th
    // schedule: '0 0 */4 * * *', // run every 4hrs // TODO: configuration, make it differently between each Pi
    schedule: XCONFIG.STPTOKEN_SYNC_TIME,
    onTick: function () {
      PublicServerUtils.getTokenToPulicServer(3);
    }
  },

  // Demo requesting to public server
  demoGetMyProfile: {
    timezone: 'Asia/Ho_Chi_Minh',
    // schedule: '0 0 */4 * * *', // run every 4hrs
    schedule: XCONFIG.DEMO_PROFILE_TIME,
    onTick: async function () {
      // await PublicServerUtils.getMyProfileSync();
      PublicServerUtils.getMyProfile();
    }
  },

  // Send daily stat
  dailyStpData: {
    timezone: 'Asia/Ho_Chi_Minh',
    // schedule: '0 23 23 * * *', // run daily at 23:23:00 // tag: [DAILY_STP_DATA]
    // schedule: '*/30 * * * * *', // run every 30 seconds
    schedule: XCONFIG.DAILY_DATA_STATS_SYNC_TIME,
    onTick: function () {
      StpStatsUtils.dailyStatsSync();
    }
  },
};