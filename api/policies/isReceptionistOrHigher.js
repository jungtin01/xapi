module.exports = function isReceptionistOrHigher(req, res, next) {
  // sails.log("checking user role, req.token", req.token);
  // sails.log("req.token: ", req.token);
  User.findOne({ id: req.token.id }).exec(function(err, user) {
    if (err) { return res.serverError(err); }

    if (!user) {
      return res.json(403,
        generateResultService.fail('this account is no longer available')
      );
    }

    if (user.role < 5) {
      return res.json(403,
        generateResultService.fail('access denied')
      );
    }

    next();
  })
};
