module.exports = function isAdmin(req, res, next) {
  // sails.log("checking admin right, req.token", req.token);
  // sails.log("req.token: ", req.token);

  // TODO: replace all using User table find by RAM
  User.findOne({ id: req.token.id }).exec(function(err, user) {
    if (err) { return res.serverError(err); }

    if (!user) {
      return res.json(403,
        generateResultService.fail('this account is no longer available')
      );
    }

    if (user.role !== 10) {
      return res.json(403,
        generateResultService.fail('access denied')
      );
    }

    next();
  })
};
