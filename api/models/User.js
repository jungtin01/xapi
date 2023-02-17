/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

let bcrypt = require('bcrypt');

module.exports = {
  schema: true,
  attributes: {
    username: {
      type: 'string',
      required: 'true',
      unique: true // Yes unique one
    },

    password: {
      type: 'string',
      required: 'true'
    },
    name: {
      type: 'string',
      required: 'true',
    },
    description: {
      type: 'string',
    },
    role: {
      type: 'integer',
      enum: [ 0,       // Employee
              5,   // Receptionist
              10,          // Admin
            ],
      defaultsTo: 0
    },
    status: {
      type: 'string',   // TODO: use integer or True/False intead
      required: 'true',
    },
    isOnline: { // TODO: this is the new status, we will delete field `status` as soon as all clients apply isOnline logic
      type: 'boolean',
      required: true,
      defaultsTo: false,
    },
    // TODO: switch to use all epoch in seconds for all datetime fields
    lastReqTime: {
      type: 'datetime',
      // defaultsTo: function () { return new Date(); } // default datime with function cause error
    },

    // which WorkSession do I have to work?
    workingTime: {
      collection: 'worksession',
      via: 'workers'
    },

    //which table am I serving?
    servingTables: { collection: 'xcaller', via: 'assignees' },

    // We don't wan't to send back encrypted password either
    toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      return obj;
    }
  },

  beforeCreate: function(value, cb) {
    //sails.log("Calling " + arguments.callee.name + " from " + __filename);
    bcrypt.genSalt(10, function(err, salt) {
      if (err) return cb(err);
      bcrypt.hash(value.password, salt, function(err, hash) {
        if (err) return cb(err);
        value.password = hash;
        cb();
      })
    });
  },

  beforeUpdate: function(value, cb) {
    //sails.log("Calling " + arguments.callee.name + " from " + __filename);
    // TODO: this function is called too many times
    // how to reduce it?
    // what is this purpose initially?
    // --> this is used for generate new password with bcrypt and delete the old password from the json data
    // can we use this code in update password controller only?
    if (value.old_password && value.old_password !== value.password) {
      bcrypt.genSalt(10, function(err, salt) {
        if (err) return cb(err);
        bcrypt.hash(value.password, salt, function(err, hash) {
          if (err) return cb(err);
          value.password = hash;
          delete value.old_password;
          cb();
        })
      });
    } else {
      delete value.old_password;
      cb();
    }
  },
};
