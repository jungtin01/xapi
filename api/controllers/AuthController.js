/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

let bcrypt = require('bcrypt');

module.exports = {
  create: function(req, res) {
    sails.log(req.method + " " + req.url);
    // //sails.log("Calling " + arguments.callee.name + " from " + __filename);
    let username = req.param('username');
    let password = req.param('password');

    if (!username || !password) {
      return res.json(401,
        generateResultService.fail('username and password required')
      );
    }

    User.findOne({ username: username }, function(err, user) {
      if (!user) {
        return res.json(401,
          generateResultService.fail('username is invalid')
        );
      }

      bcrypt.compare(password, user.password, function(err, valid) {
        if (err) {
          return res.json(403,
            generateResultService.fail('forbidden')
          );
        }

        if (!valid) {
          return res.json(401,
            generateResultService.fail('password is invalid')
          );
        } else {
          res.json(
            generateResultService.success({
              token: jwToken.issue({ id: user.id }),
              userId: user.id,
              role: user.role,
              userName: user.name
            })
          );

          // update the lastReq
          UserUtils.updateLastReqTimestamp({userId: user.id});
        }
      });
    })
  },

  logout: function(req, res) {
    let userId = req.token.id;
    if (!UserUtils.users.hasOwnProperty(userId)) {
      sails.log("Invalid userId. Could not logout " + userId);
      res.badRequest(generateResultService.fail("Invalid userId. Could not logout"));
    } else {
      res.json(generateResultService.success({}));

      let now = Date.now();
      UserUtils.onUserOffline({userId: userId, time: new Date(now)});
    }
  },
};
