/**
 * Xcaller.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    xcallerName: { type: 'string', unique: true, required: true, minLength: 1, maxLength: 3 },
    xcallerId: { type: 'string', unique: true, required: true },
    isActive: { type: 'boolean', defaultsTo: true, required: true},
    remainingBatteryValue: { type: 'float', defaultsTo: 0.0, required: 'true' }, // TODO: use default setting from Battery.js
    remainingBatteryTimeInHour: { type: 'integer', defaultsTo: 0, required: 'true' }, // TODO: use default setting from Battery.js

    // request are sent by this table
    // requests: { collection: 'customerrequest', via: 'table' },

    // who are taking care this table?
    assignees: { collection: 'user', via: 'servingTables' },

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
