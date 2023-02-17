/**
 * Timesheet.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    // There are multiple timesheet records per user per day
    userId: { model: 'user', required: true, index: true },
    datesod: { type: 'integer', required: true }, // epoch time, start of day
    inTime: { type: 'integer', defaultsTo: 0 },   // epoch time
    outTime: { type: 'integer', defaultsTo: 0 },  // epoch time
  }
};

