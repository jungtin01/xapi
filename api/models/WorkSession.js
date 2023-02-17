/**
 * WorkSession.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    sessionName: { type: 'string', required: 'true', unique: true },
    timeFrom: { type: 'integer', min: 0, max: 24 * 60 * 60 },
    timeTo: { type: 'integer', min: 0, max: 24 * 60 * 60 },

    // Who are working in this session?
    workers: {
      collection: 'user',
      via: 'workingTime'
    },
  }
};

