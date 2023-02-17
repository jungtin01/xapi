/**
 * BatteryController
 *
 * @description :: Server-side logic for managing Batteries
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  getBatterySetting: function(req, res) {
    //sails.log("Calling " + arguments.callee.name + " from " + __filename);
    Battery.find({
      limit: 1,
    }).exec(function(err, responsedObj) {
      if (err) return res.serverError(err);
      else return res.json(generateResultService.success({ total: responsedObj.length, data: responsedObj }));
    });
  },

  setAlertThreshold: function(req, res) {
    //sails.log("Calling " + arguments.callee.name + " from " + __filename);
    // if (_.isUndefined(req.params['id'])) {
    //   return res.badRequest(generateResultService.fail('id is required'));
    // }

    Battery.find({ limit: 1 }).exec(function(err, updatedObj) {
      if (err) { return res.serverError(err); }
      if (!updatedObj) { return res.badRequest(generateResultService.fail('This BatteryInfo does not exist')); }

      // sails.log("debug typeof lowerLimit ", typeof(parseFloat(req.param('lowerLimit'))));
      if (_.isNaN(parseFloat(req.param('lowerLimit')))) {
        return res.badRequest(generateResultService.fail('lowerLimit must be float'));
      }
      if (_.isNaN(parseFloat(req.param('upperLimit')))) {
        return res.badRequest(generateResultService.fail('upperLimit must be float'));
      }
      if (_.isNaN(parseFloat(req.param('alertThreshold')))) {
        return res.badRequest(generateResultService.fail('alertThreshold must be float'));
      }

      let valLower = parseFloat(req.param('lowerLimit'));
      let valUpper = parseFloat(req.param('upperLimit'));
      let valThres = parseFloat(req.param('alertThreshold'));
      if (!(valLower < valThres && valThres < valUpper)) {
        return res.badRequest(generateResultService.fail('Please check value constraint: lowerLimit < alertThreshold < upperLimit'));
      }

      sails.log("updating upper & lower alerting settings...");
      Battery.update({ id: updatedObj[0].id }, {
        lowerLimit: parseFloat(req.param('lowerLimit')),
        upperLimit: parseFloat(req.param('upperLimit')),
        alertThreshold: parseFloat(req.param('alertThreshold'))
      }).exec(function(err, Battery) {
        if (err) {
          return res.json(err.status, { err: err });
        }
        sails.log("total item of Battery ", Battery.length);
        if (Battery) {
          res.json(generateResultService.success({ total: Battery.length, data: Battery }));
        } else {
          return res.serverError("Could not update battery record"); // TODO: apply this fix for all other controller
        }
      });
    });
  },
};
