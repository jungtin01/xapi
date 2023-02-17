/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  findAll: function(req, res) {
    //sails.log("Calling " + arguments.callee.name + " from " + __filename);
    User.find({
      where: {
        // username: {'!=' : 'sadmin'}, // not equal
        username: { '!' : ['sadmin', 'stp'] } // not in
      },
      sort: 'id DESC'
    }).populate('workingTime', {select: ['sessionName', 'timeFrom', 'timeTo']})
      .populate('servingTables', {select: ['xcallerName', 'xcallerId']})
      .exec(function(err, users) {
      if (err) { return res.serverError(err); }
      return res.json(
        generateResultService.success({
          total: users.length,
          data: users
        })
      );
    });
  },

  getProfile: function(req, res) {
    //sails.log("Calling " + arguments.callee.name + " from " + __filename);
    if (_.isUndefined(req.params['id'])) {
      return res.badRequest(generateResultService.fail('id is required'));
    }

    User.findOne({ id: req.params['id'] })
    .populate('workingTime', {select: ['sessionName', 'timeFrom', 'timeTo']})
    .populate('servingTables', {select: ['xcallerName', 'xcallerId']})
    .exec(function(err, foundObj) {
      if (err) { return res.serverError(err); }
      if (!foundObj) { return res.badRequest(generateResultService.fail('This user id is not exist')); }
      return res.json(generateResultService.success({ data: foundObj }));
    })
  },

  getMyProfile: function(req, res) {
    //sails.log("Calling " + arguments.callee.name + " from " + __filename);
    User.findOne({ id: req.token.id })
    .populate('workingTime', {select: ['sessionName', 'timeFrom', 'timeTo']})
    .populate('servingTables', {select: ['xcallerName', 'xcallerId']})
    .exec(function(err, foundObj) {
      if (err) { return res.serverError(err); }
      if (!foundObj) { return res.badRequest(generateResultService.fail('Could not find your user id')); }
      return res.json(generateResultService.success({ data: foundObj }));
    })
  },

  create: function(req, res) {
    //sails.log("Calling " + arguments.callee.name + " from " + __filename);
    let result = validation.check({
      stringUsername: req.param('username'),
      stringName: req.param('name'),
      stringDescription: req.param('description') ? req.param('description') : "UNK",
      stringPassword: req.param('password'),
      stringStatus: req.param('status'),
      // datetimeLastReqTime: new Date(),
      integerRole: req.param('role')
    });
    if (result.status === true) {
      // TODO: check if `status` field is useless --> remove it, also review all User model
      if (['active', 'inactive'].indexOf(req.param('status')) === -1) {
        return res.badRequest(generateResultService.fail('status must be active or inactive'));
      }

      result.data.lastReqTime = new Date();

      User.findOne({ username: req.param('username') }).exec(function(err, user) {
        if (err) {
          return res.json(err.status, { err: err });
        }
        if (user) {
          return res.badRequest(generateResultService.fail('The user already exists'))
        }

        User.create(result.data).exec(function(err, user) {
          if (err) {
            return res.json(err.status, { err: err });
          }

          // If user created successfuly we return user and token as response
          if (user) {
            User.findOne({username: req.param('username')})
            .populate('workingTime', {select: ['sessionName', 'timeFrom', 'timeTo']})
            .populate('servingTables', {select: ['xcallerName', 'xcallerId']})
            .exec(function(err, foundUser) {
              if (err) { return res.json(err.status, { err: err }); }
              if (foundUser) {
                res.json(generateResultService.success({data: foundUser}));
                UserUtils.updateUser(user.id, user);
              } else {
                return res.serverError("Could not find newly created user");
              }
            });
          } else {
            return res.serverError("Could not create new record"); // TODO: apply this fix for all other controller
          }
        });
      })
    } else {
      res.badRequest(
        generateResultService.fail(result.message)
      )
    }
  },

  update: function(req, res) {
    //sails.log("Calling " + arguments.callee.name + " from " + __filename);
    if (_.isUndefined(req.params['id'])) {
      return res.badRequest(generateResultService.fail('id is required'));
    }
    User.findOne({ id: req.params['id'] }).exec(function(err, user) {
      if (err) { return res.serverError(err); }
      if (!user) {
        return res.badRequest(generateResultService.fail('The user does not exists'));
      }

      let result = validation.check({
        stringName: req.param('name') ? req.param('name') : user.name,
        stringPassword: req.param('password') ? req.param('password') : user.password,
        stringStatus: req.param('status') ? req.param('status') : user.status,
        stringDescription: req.param('description') ? req.param('description') : user.description,
      });
      if (result.status === true) {
        if (['active', 'inactive'].indexOf(req.param('status')) === -1) {
          return res.badRequest(generateResultService.fail('status must be active or inactive'));
        }

        result.data.lastReqTime = new Date();
        result.data['old_password'] = user.password;
        User.update({ id: user.id }, result.data).exec(function(err, user) {
          if (err) {
            return res.json(err.status, { err: err });
          }

          // If user created successfuly we return user and token as response
          if (user) {
            // res.json( generateResultService.success({ data: user}) );
            User.findOne({ id: req.params['id'] })
            .populate('workingTime', {select: ['sessionName', 'timeFrom', 'timeTo']})
            .populate('servingTables', {select: ['xcallerName', 'xcallerId']})
            .exec(function(err, foundUser) {
              if (err) { return res.json(err.status, { err: err }); }
              if (foundUser) {
                res.json(generateResultService.success({data: foundUser}));
                if (user.length > 0) { UserUtils.updateUser(user[0].id, user[0]); }
                else { sails.log.error("Could not update any user obj"); }
              } else {
                return res.serverError("Could not find newly updated user");
              }
            });
          } else {
            return res.serverError("Could not update user record");
          }
        });
      } else {
        return res.badRequest(generateResultService.fail(result.message))
      }
    });
  },

  changePassword: function(req, res) {
    // TODO: review change password action?
    //sails.log("Calling " + arguments.callee.name + " from " + __filename);
    let result = validation.check({
      stringPassword: req.param('password'),
    });
    if (result.status === true) {
      User.findOne({ id: req.token.id }).exec(function(err, user) {
        if (err) {
          return res.serverError(err);
        }
        if (!user) {
          return res.badRequest(
            generateResultService.fail('The user does not exists')
          );
        }

        result.data['old_password'] = user.password;

        User.update({ id: user.id }, result.data).exec(function(err, user) {
          if (err) {
            return res.json(err.status, { err: err });
          }

          // If user created successfuly we return user and token as response
          res.json(
            generateResultService.success({
              // data: user
              data: {}
            })
          );
          if (user.length > 0) { UserUtils.updateUser(user[0].id, user[0]); }
          else { sails.log.error("Could not update any user obj"); }
        });
      });
    } else {
      return res.badRequest(generateResultService.fail(result.message))
    }
  },
  
  delete: function(req, res) {
    //sails.log("Calling " + arguments.callee.name + " from " + __filename);
    if (_.isUndefined(req.params['id'])) {
      return res.badRequest(
        generateResultService.fail('id is required')
      );
    }
    User.findOne({ id: req.param('id') }).exec(function(err, user) {
      if (err) return res.negotiate(err);
      if (!user) {
        return res.badRequest(
          generateResultService.fail('The user does not exists')
        );
      }
      
      // TODO: longnkh: should prevent delete all admin user or not?
      // We should always have at least 1 admin user in the DB?

      // Destroy User
      User.destroy({ id: user.id }).exec(function(err) {
        if (err) return res.negotiate(err);
        res.json(
          generateResultService.success({
            data: []
          })
        );
        UserUtils.deleteUser(req.param('id'));
      });
    });
  },

};
