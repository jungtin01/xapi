/**
 * CustomerRequest.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    // which table is requesting this request?
    table: { model: 'xcaller', required: true },

    // who is assigned this request
    owner: { model: 'user', required: 'true', },
    proxies: { collection: 'user', required: 'true', },

    // request for what?
    requestType: {
      type: 'string',
      required: 'true',
      enum: [ 'M', // 'Menu',
              'B', // 'Bill',
              'C', // 'Call'
              'W', // 'Water'
            ]
    },

    requestStatus: {
      type: 'string',
      required: 'true',
      enum: [ 'N', // 'new' : just created to system, not received by any employee
              'R', // 'received' by employee,
              'C', // 'completed' by employee,
            ],
      defaultsTo: 'N'
    },

    // createdAt is added by default sails's configuration, no need to declare it here
    receivedAt: { type: 'datetime', defaultsTo: undefined},
    closedAt: { type: 'datetime', defaultsTo: undefined},

    // TODO: for debugging purposes
    includedInDailyStatistics: {model: 'statisticsday'}, 
    includedInHourlyStatistics: {model: 'statisticshour'}, 
  }
};
