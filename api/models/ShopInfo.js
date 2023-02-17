/**
 * ShopInfo.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    suser: { type: 'string', required: true, unique: true}, // Sync User
    spwd: { type: 'string', required: true }, // base-64
    shopName: { type: 'string', required: true },
    address: { type: 'string' },
    openTime: { type: 'integer', min: 0, max: 24 * 60 * 60 },
    closeTime: { type: 'integer', min: 0, max: 24 * 60 * 60 - 1 },
    contactInfo: { type: 'string' },
    maxWaitingTime: { type: 'integer', min: 0 }, // value in seconds, e.g: 99 means 1 minute and 39 seconds
    logLevel: { type: 'string', enum: ['info', 'debug', 'warning', 'error', 'fatal'] },
    maxRequestPerEmployee: { type: 'integer', min: 0 },
    maxRequestTimeout: { type: 'integer', min: 0 },
    requestTtl: { type: 'integer', min: 0, max: 1 * 60 * 60, defaultsTo: 0 }, // in seconds


    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝


    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

  },

};
