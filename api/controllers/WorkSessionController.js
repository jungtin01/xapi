/**
 * WorkSessionController
 *
 * @description :: Server-side logic for managing Worksessions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  createSession: function(req, res) {
    //sails.log("Calling " + arguments.callee.name + " from " + __filename);

    let result = validation.check({
      stringSessionName: req.param('sessionName'),
      integerTimeFrom: req.param('timeFrom') ? parseInt(req.param('timeFrom')) : 0,
      integerTimeTo: req.param('timeTo') ? parseInt(req.param('timeTo')) : 0,
    });
    if (result.status === true) {
      sails.log("creating new work session");
      WorkSession.create(result.data).exec(function(err, newobj) {
        if (err) {
          return res.json(err.status, { err: err });
        }
        if (newobj) {
          // res.json(generateResultService.success({ data: newobj }));
          WorkSession.findOne({ id: newobj.id }).populate('workers').exec(function(err, resultObj) {
            if (err) {
              return res.json(err.status, { err: err });
            }
            if (resultObj) {
              res.json(generateResultService.success({ data: resultObj }));
            } else {
              return res.serverError("Could not find newly created record");
            }
          });
        } else {
          return res.serverError("Could not create new record");
        }
      });
    } else {
      return res.badRequest(generateResultService.fail(result.message));
    }
  },

  getSession: function(req, res) {
    //sails.log("Calling " + arguments.callee.name + " from " + __filename);
    if (_.isUndefined(req.params['id'])) {
      return res.badRequest(generateResultService.fail('id is required'));
    }

    WorkSession.findOne({ id: req.params['id'] }).populate('workers').exec(function(err, foundObj) {
      if (err) { return res.serverError(err); }
      if (!foundObj) { return res.badRequest(generateResultService.fail('This Work Session is not exist')); }
      return res.json(generateResultService.success({ data: foundObj }));
    })
  },

  getSessions: function(req, res) {
    //sails.log("Calling " + arguments.callee.name + " from " + __filename);

    WorkSession.find({
      // limit: 10,
      // skip: req.param('skip'), // TODO: longnkh, what to input for 'skip'?
      // sort: 'id DESC'
    }).populate('workers').exec(function(err, foundObjs) {
      if (err) { return res.serverError(err); }
      return res.json(
        generateResultService.success({
          total: foundObjs.length,
          data: foundObjs
        })
      );
    });
  },

  updateSession: function(req, res) {
    //sails.log("Calling " + arguments.callee.name + " from " + __filename);
    if (_.isUndefined(req.params['id'])) {
      return res.badRequest(generateResultService.fail('id is required'));
    }

    WorkSession.findOne({ id: req.params['id'] }).exec(function(err, foundObj) {
      if (err) { return res.serverError(err); }
      if (!foundObj) { return res.badRequest(generateResultService.fail('This Work Session is not exist')); }

      let result = validation.check({
        stringSessionName: req.param('sessionName') ? req.param('sessionName') : foundObj.sessionName,
        integerTimeFrom: req.param('timeFrom') ? parseInt(req.param('timeFrom')) : foundObj.timeFrom,
        integerTimeTo: req.param('timeTo') ? parseInt(req.param('timeTo')) : foundObj.timeTo,
      });
      if (result.status === true) {
        sails.log("updating Work Session info");
        WorkSession.update({ id: foundObj.id }, result.data).exec(function(err, updatedObj) {
          if (err) {
            return res.json(err.status, { err: err });
          }
          sails.log("total item of Work Session ", updatedObj.length);
          if (updatedObj) {
            // res.json(generateResultService.success({ total: updatedObj.length, data: updatedObj }));
            WorkSession.find({ id: req.params['id'] }).populate('workers').exec(function(err, resultObj) {
              if (err) {
                return res.json(err.status, { err: err });
              }
              if (resultObj) {
                res.json(generateResultService.success({ data: resultObj }));
              } else {
                return res.serverError("Could not find newly updated record");
              }
            });
          } else {
            return res.serverError("Could not update work session record");
          }
        });
      } else {
        res.badRequest(generateResultService.fail(result.message))
      }
    });
  },

  deleteSession: function(req, res) {
    //sails.log("Calling " + arguments.callee.name + " from " + __filename);
    if (_.isUndefined(req.params['id'])) {
      return res.badRequest(
        generateResultService.fail('id is required')
      );
    }

    WorkSession.findOne({ id: req.param('id') }).exec(function(err, foundObj) {
      if (err) { return res.serverError(err); }
      if (!foundObj) { return res.badRequest(generateResultService.fail('This Work Session is not exist')); }

      WorkSession.destroy({ id: foundObj.id }).exec(function(err) {
        if (err) { return res.serverError(err); }
        return res.json(generateResultService.success({ data: [] }));
      });
    });
  },

  assignWorkSession: async function(req, res) {
    //sails.log("Calling " + arguments.callee.name + " from " + __filename);
    let sUsername = req.param('username');
    // let sSessionName = req.param('sessionName');
    let userId = req.param('userId');    
    let workSessionId = req.param('sessionId');

    if (!sUsername && !userId) {
      return res.badRequest(generateResultService.fail("username and userId are missing")); 
    }
    // if (!sSessionName && !workSessionId) {
    if (!workSessionId) {
      return res.badRequest(generateResultService.fail("session id is missing")); 
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
    
    // Get the WorkSession record
    let foundWorkSession;
    if (workSessionId) {
      foundWorkSession = await WorkSession.findOne({id: workSessionId});
      sails.log("foundWorkSession with session id ", foundWorkSession);
    }
    // sails.log("foundWorkSession final check ", foundWorkSession);
    if (!foundWorkSession) {
      return res.badRequest(generateResultService.fail("Could not find WorkSession")); 
    }

    // Add WorkSession to working time of User
    sails.log("Adding work session " + foundWorkSession.sessionName + " to username " + foundUser.username);
    await foundUser.workingTime.add(foundWorkSession.id);
    await foundUser.save(function (err){
      if (err) {
        return res.json(err.status, { err: err });
      }
      User.findOne({id: foundUser.id}).populate('workingTime', {select: ['sessionName', 'timeFrom', 'timeTo']}).exec(function(err, updatedUser) {
        if (err) {
          return res.json(err.status, { err: err });
        }
        if (updatedUser) {
          res.json(generateResultService.success({ data: updatedUser }));
        } else {
          return res.serverError("Could not retrieve data after updating");
        }
      });
    });
    // await User.findOne({id: foundUser.id}).populate('workingTime', {select: ['sessionName', 'timeFrom', 'timeTo']}).exec(function(err, updatedUser) {
    //   if (err) {
    //     return res.json(err.status, { err: err });
    //   }
    //   if (updatedUser) {
    //     res.json(generateResultService.success({ data: updatedUser }));
    //   } else {
    //     return res.serverError("Could not retrieve data after updating");
    //   }
    // });
  },

  removeWorkSession: async function(req, res) {
    //sails.log("Calling " + arguments.callee.name + " from " + __filename);
    let sUsername = req.param('username');
    // let sSessionName = req.param('sessionName');
    let userId = req.param('userId');    
    let workSessionId = req.param('sessionId');

    if (!sUsername && !userId) {
      return res.badRequest(generateResultService.fail("username and userId are missing")); 
    }
    // if (!sSessionName && !workSessionId) {
    if (!workSessionId) {
      return res.badRequest(generateResultService.fail("session id is missing")); 
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
    
    // Get the WorkSession record
    let foundWorkSession;
    if (workSessionId) {
      foundWorkSession = await WorkSession.findOne({id: workSessionId});
      sails.log("foundWorkSession with session id ", foundWorkSession);
    }
    // sails.log("foundWorkSession final check ", foundWorkSession);
    if (!foundWorkSession) {
      return res.badRequest(generateResultService.fail("Could not find WorkSession")); 
    }

    // Add WorkSession to working time of User
    sails.log("Adding work session " + foundWorkSession.sessionName + " to username " + foundUser.username);
    await foundUser.workingTime.remove(foundWorkSession.id);
    await foundUser.save(function (err){
      if (err) {
        return res.json(err.status, { err: err });
      }
      User.findOne({id: foundUser.id}).populate('workingTime', {select: ['sessionName', 'timeFrom', 'timeTo']}).exec(function(err, updatedUser) {
        if (err) {
          return res.json(err.status, { err: err });
        }
        if (updatedUser) {
          res.json(generateResultService.success({ data: updatedUser }));
        } else {
          return res.serverError("Could not retrieve data after updating");
        }
      });
    });
    // await User.findOne({id: foundUser.id}).populate('workingTime', {select: ['sessionName', 'timeFrom', 'timeTo']}).exec(function(err, updatedUser) {
    //   if (err) {
    //     return res.json(err.status, { err: err });
    //   }
    //   if (updatedUser) {
    //     res.json(generateResultService.success({ data: updatedUser }));
    //   } else {
    //     return res.serverError("Could not retrieve data after updating");
    //   }
    // });
    // res.json(generateResultService.success({}));
  },
};

