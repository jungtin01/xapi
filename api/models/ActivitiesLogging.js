/**
 * ActivitiesLogging.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  // LongNKH's note
  // Do we need separate activities logging model here? Why?
  // We need because:
  //  * Customer Request is very similar to this, but it only presents the current state of order
  //  * We need to understand the full lifecyle of every order
  //  * We also need to add more events to this model later
  //
  // Expectation: every activity happens will trigger a record creation with this model
  attributes: {

    requestTime: { type: 'datetime'},

    // All acitivies have the same requestId is belong to an order
    requestId: { type: 'string', required: true},

    // which table is requesting this request?
    table: { model: 'xcaller', required: true },

    owner: { model: 'user', required: true },

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

    waitingTimeInSeconds: { type: 'integer', defaultsTo: 0},
    description: { type: 'string'},
  }
};
