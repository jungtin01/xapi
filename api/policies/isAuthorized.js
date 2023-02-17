/**
 * isAuthorized
 *
 * @description :: Policy to check if user is authorized with JSON web token
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Policies
 */

module.exports = function(req, res, next) {
  if (req.url != "/api/all-requests") sails.log(req.method + " " + req.url);
  let token;
  if (req.headers && req.headers.authorization) {
    let parts = req.headers.authorization.split(' ');
    if (parts.length == 2) {
      let scheme = parts[0],
        credentials = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        token = credentials;
      }
    } else {
      return res.json(401, generateResultService.fail('Format is Authorization: Bearer [token]'));
    }
  } else if (req.param('token')) {
    token = req.param('token');
    // We delete the token from param to not mess with blueprints
    delete req.query.token;
  } else {
    return res.json(401, generateResultService.fail('No Authorization header was found'));
  }

  jwToken.verify(token, function(err, token) {
    if (err) {
      sails.log.error("Verified error: " + err);
      return res.json(401, generateResultService.fail("Invalid Token!"));
    }
    req.token = token; // This is the decrypted token or the payload you provided
    // console.log("this sid: ", sails.sid);
    // console.log("req.session: ", req.session);

    
    // update the lastReq
    UserUtils.updateLastReqTimestamp({userId: req.token.id});
    next();
  });
};
