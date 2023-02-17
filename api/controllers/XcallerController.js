/**
 * XcallerController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  addxcaller: function(req, res) {
    //sails.log("Calling " + arguments.callee.name + " from " + __filename);
    let action = req.param('action');
    if (_.isUndefined(action)) {
      return res.badRequest(generateResultService.fail('action is required'));
    }

    if (action.toLowerCase() === 'on') {
      XcallerUtils.switchAddingXcaller({flag: true});
    } else if (action.toLowerCase() === 'off') {
      XcallerUtils.switchAddingXcaller({flag: false});
    } else {
      return res.badRequest(generateResultService.fail('invalid action'));
    }

    return res.json(generateResultService.success({ action : action}));
  },

  createXcaller: function(req, res) {
    //sails.log("Calling " + arguments.callee.name + " from " + __filename);

    let result = validation.check({
      stringXcallerName: req.param('xcallerName'),
      stringXcallerId: req.param('xcallerId'),
      integerRemainingBatteryTimeInHour: req.param('remainingBatteryTimeInHour') ? parseInt(req.param('remainingBatteryTimeInHour')) : 0,
      floatRemainingBatteryValue: req.param('remainingBatteryValue') ? parseFloat(req.param('remainingBatteryValue')) : 0.0,
    });
    if (result.status === true) {
      //xcallerName in req is validated as string
      if (result.data.xcallerName.length > 3 || result.data.xcallerName.length < 1) {
        return res.badRequest(generateResultService.fail('xcaller name length is restricted'));
      }

      sails.log("Creating new xcaller");
      Xcaller.create(result.data).exec(function(err, xcaller) {
        if (err) { return res.json(err.status, { err: err }); }
        if (xcaller) {
          // res.json(generateResultService.success({ data: xcaller }));
          Xcaller.findOne({ id: xcaller.id }).populate('assignees').exec(function(err, resultObj) {
            if (err) { return res.serverError(err); }
            if (!resultObj) { return res.badRequest(generateResultService.fail('Could not retrieve xcaller after creating')); }
            res.json(generateResultService.success({ data: resultObj }));
            XcallerUtils.updateXcaller(resultObj.id, resultObj);
          })
        } else {
          return res.serverError("Could not create new record"); // TODO: apply this fix for all other controller
        }
      });
    } else {
      return res.badRequest(generateResultService.fail(result.message));
    }
  },

  getAllXcallers: function(req, res) {
    //sails.log("Calling " + arguments.callee.name + " from " + __filename);

    Xcaller.find({
    }).populate('assignees').exec(function(err, devices) {
      if (err) { return res.serverError(err); }
      return res.json(
        generateResultService.success({
          total: devices.length,
          data: devices
        })
      );
    });
  },

  getOneXcaller: function(req, res) {
    //sails.log("Calling " + arguments.callee.name + " from " + __filename);
    if (_.isUndefined(req.params['id'])) {
      return res.badRequest(generateResultService.fail('id is required'));
    }

    Xcaller.findOne({ id: req.params['id'] }).populate('assignees').exec(function(err, device) {
      if (err) { return res.serverError(err); }
      if (!device) { return res.badRequest(generateResultService.fail('This xcaller device is not exist')); }
      return res.json(generateResultService.success({ data: device }));
    })
  },

  updateXcaller: function(req, res) {
    //sails.log("Calling " + arguments.callee.name + " from " + __filename);
    if (_.isUndefined(req.params['id'])) {
      return res.badRequest(generateResultService.fail('id is required'));
    }

    Xcaller.findOne({ id: req.params['id'] }).exec(function(err, device) {
      if (err) { return res.serverError(err); }
      if (!device) { return res.badRequest(generateResultService.fail('This xcaller device is not exist')); }

      let result = validation.check({
        stringXcallerName: req.param('xcallerName') ? req.param('xcallerName') : device.xcallerName,
        stringXcallerId: req.param('xcallerId') ? req.param('xcallerId') : device.xcallerId,
      });
      if (result.status === true) {
        //xcallerName in req is validated as string
        if (result.data.xcallerName.length > 3 || result.data.xcallerName.length < 1) {
          return res.badRequest(generateResultService.fail('xcaller name length is restricted'));
        }

        sails.log("Updating xcaller device info");
        Xcaller.update({ id: device.id }, result.data).exec(function(err, newxcaller) {
          if (err) { return res.json(err.status, { err: err }); }
          sails.log("total item of xcaller ", newxcaller.length);
          if (newxcaller) {
            // res.json(generateResultService.success({ total: newxcaller.length, data: newxcaller }));
            Xcaller.find({id: device.id}).populate('assignees').exec(function(err, resultObjs) {
              if (err) { return res.serverError(err); }
              res.json(generateResultService.success({ total: resultObjs.length, data: resultObjs}));
              if (resultObjs.length > 0) { XcallerUtils.updateXcaller(resultObjs[0].id, resultObjs[0]); }
              else { sails.log.error("Could not update any xcaller obj"); }
            });
          } else {
            return res.serverError("Could not update record");
          }
        });
      } else {
        return res.badRequest(generateResultService.fail(result.message))
      }
    });
  },

  deleteXcaller: function(req, res) {
    //sails.log("Calling " + arguments.callee.name + " from " + __filename);
    if (_.isUndefined(req.params['id'])) {
      return res.badRequest(
        generateResultService.fail('id is required')
      );
    }

    Xcaller.findOne({ id: req.param('id') }).exec(function(err, device) {
      if (err) { return res.serverError(err); }
      if (!device) { return res.badRequest(generateResultService.fail('This xcaller device is not exist')); }

      Xcaller.destroy({ id: device.id }).exec(function(err) {
        if (err) { return res.serverError(err); }
        res.json(generateResultService.success({ data: [] }));
        XcallerUtils.deleteXcaller(device.id);
      });
    });
  },

  // getBatteryStatus: function (req, res) {
  //     will use the same function for getOneXcaller
  // },

  updateBatteryStatus: function(req, res) {
    //sails.log("Calling " + arguments.callee.name + " from " + __filename);
    if (_.isUndefined(req.params['id'])) {
      return res.badRequest(generateResultService.fail('id is required'));
    }

    Xcaller.findOne({ id: req.params['id'] }).exec(function(err, device) {
      if (err) { return res.serverError(err); }
      if (!device) { return res.badRequest(generateResultService.fail('This xcaller device is not exist')); }

      sails.log("Validating xcaller battery status for ", req.params['id']);
      Xcaller.update({ id: req.params['id'] }, {
        remainingBatteryValue: req.param('remainingBatteryValue') ? parseFloat(req.param('remainingBatteryValue')) : device.remainingBatteryValue,
        remainingBatteryTimeInHour: req.param('remainingBatteryTimeInHour') ? parseInt(req.param('remainingBatteryTimeInHour')) : device.remainingBatteryTimeInHour,
      }).exec(function(err, newxcaller) {
        if (err) {
          return res.json(err.status, { err: err });
        }
        sails.log("Total item of xcaller ", newxcaller.length);
        if (newxcaller) {
          // res.json(generateResultService.success({ total: newxcaller.length, data: newxcaller }));
          Xcaller.findOne({ id: req.params['id'] }).populate('assignees').exec(function(err, resultObjs) {
            if (err) { return res.serverError(err); }
            if (!resultObjs) { return res.badRequest(generateResultService.fail('Could not find xcaller after updating battery')); }
            res.json(generateResultService.success({ data: resultObjs }));
            XcallerUtils.updateXcaller(resultObjs.id, resultObjs);
          })
        } else {
          return res.serverError("Could not update xcaller record");
        }
      });
    });
  },

  assignTable: async function(req, res) {
    //sails.log("Calling " + arguments.callee.name + " from " + __filename);

    let sUsername = req.param('username');
    let userId = req.param('userId');    
    let sXcallerName = req.param('xcallerName');

    if (!sUsername && !userId) {
      return res.badRequest(generateResultService.fail("username and userId are missing")); 
    }
    if (!sXcallerName) {
      return res.badRequest(generateResultService.fail("xcaller name is missing")); 
    }

    // Get the User record
    let foundUser;
    if (userId) {
      foundUser = await User.findOne({id: userId});
      sails.log("foundUser with userId ", foundUser);
    }
    if (!foundUser && sUsername) {
      foundUser = await User.findOne({username: sUsername});
      sails.log("foundUser with username ", foundUser);
    }
    // sails.log("foundUser final check ", foundUser);
    if (!foundUser) {
      return res.badRequest(generateResultService.fail("Could not find any username nor user id")); 
    }
    
    // Get the xcaller record
    let foundXcaller;
    if (sXcallerName) {
      foundXcaller = await Xcaller.findOne({xcallerName: sXcallerName});
      sails.log("foundXcaller with xcaller name ", foundXcaller);
    }
    // sails.log("foundXcaller final check ", foundXcaller);
    if (!foundXcaller) {
      return res.badRequest(generateResultService.fail("Could not find any table")); 
    }

    // Add WorkSession to working time of User
    sails.log("Assigning table " + foundXcaller.xcallerName + " to username " + foundUser.username);
    await foundUser.servingTables.add(foundXcaller.id);
    await foundUser.save(function (err){
      if (err) {
        return res.json(err.status, { err: err });
      }
      User.findOne({id: foundUser.id}).populate('servingTables', {select: ['xcallerName', 'xcallerId']}).exec(function(err, updatedUser) {
        if (err) {
          return res.json(err.status, { err: err });
        }
        if (updatedUser) {
          res.json(generateResultService.success({ data: updatedUser }));

          // TODO: if we need assignee list, then we need this update
          Xcaller.findOne({ id: foundXcaller.id }).populate('assignees').exec(function(err, resultObjs) {
            if (resultObjs) XcallerUtils.updateXcaller(resultObjs.id, resultObjs);
            else { sails.log.error("Could not update any xcaller obj"); }
          })
        } else {
          return res.serverError("Could not retrieve data after updating");
        }
      });
    });
  },

  removeTable: async function(req, res) {
    //sails.log("Calling " + arguments.callee.name + " from " + __filename);

    let sUsername = req.param('username');
    let userId = req.param('userId');    
    let sXcallerName = req.param('xcallerName');

    if (!sUsername && !userId) {
      return res.badRequest(generateResultService.fail("username and userId are missing")); 
    }
    if (!sXcallerName) {
      return res.badRequest(generateResultService.fail("xcaller name is missing")); 
    }

    // Get the User record
    let foundUser;
    if (userId) {
      foundUser = await User.findOne({id: userId});
      sails.log("foundUser with userId ", foundUser);
    }
    if (!foundUser && sUsername) {
      foundUser = await User.findOne({username: sUsername});
      sails.log("foundUser with username ", foundUser);
    }
    // sails.log("foundUser final check ", foundUser);
    if (!foundUser) {
      return res.badRequest(generateResultService.fail("Could not find any username nor user id")); 
    }
    
    // Get the xcaller record
    let foundXcaller;
    if (sXcallerName) {
      foundXcaller = await Xcaller.findOne({xcallerName: sXcallerName});
      sails.log("foundXcaller with xcaller name ", foundXcaller);
    }
    // sails.log("foundXcaller final check ", foundXcaller);
    if (!foundXcaller) {
      return res.badRequest(generateResultService.fail("Could not find any table")); 
    }

    // Add WorkSession to working time of User
    sails.log("Removing table " + foundXcaller.xcallerName + " from username", foundUser.username);
    await foundUser.servingTables.remove(foundXcaller.id);
    await foundUser.save(function (err){
      if (err) {
        return res.json(err.status, { err: err });
      }
      User.findOne({id: foundUser.id}).populate('servingTables', {select: ['xcallerName', 'xcallerId']}).exec(function(err, updatedUser) {
        if (err) {
          return res.json(err.status, { err: err });
        }
        if (updatedUser) {
          res.json(generateResultService.success({ data: updatedUser }));

          // TODO: if we need assignee list, then we need this update
          Xcaller.findOne({ id: foundXcaller.id }).populate('assignees').exec(function(err, resultObjs) {
            if (resultObjs) XcallerUtils.updateXcaller(resultObjs.id, resultObjs);
            else { sails.log.error("Could not update any xcaller obj"); }
          })
        } else {
          return res.serverError("Could not retrieve data after updating");
        }
      });
    });
  },
};
