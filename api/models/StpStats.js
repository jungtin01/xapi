/**
 * StpStats.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  // This model only have 1 record
  attributes: {
    shopinfoLastId: { type: 'integer', required: true, defaultsTo: 0 },
    // menuLastId: { type: 'integer', required: true, defaultsTo: 0 },
    // activityLastId: { type: 'integer', required: true, defaultsTo: 0 },
  }
};

