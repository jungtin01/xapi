/**
 * StatisticsDay.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  // The only difference between StatisticsDay vs StatisticsHour is the table to save records
  // TODO IMPORTANT: how about timezone handling?

  attributes: {
    date: {type: 'datetime', required: true},
    avgWaitingTimeInSeconds: {type: 'integer', required: true},
    totalRequests: {type: 'integer', required: true},
    validReceivedRequests: {type: 'integer', required: true},
  }
};

