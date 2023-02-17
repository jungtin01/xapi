/**
 * ShopInfoController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

let base64 = require('base-64');

module.exports = {

  createShopInfo: function(req, res) {
    //sails.log("Calling " + arguments.callee.name + " from " + __filename);
    ShopInfo.count().exec(function(err, total) {
      if (err) return res.negotiate(err);
      if (total > 0) {
        return res.badRequest(generateResultService.fail("Could not create more than 1 Shop"));
      } else {
        let result = validation.check({
          stringShopName: req.param('shopName'),
          stringAddress: req.param('address') ? req.param('address') : "",
          stringContactInfo: req.param('contactInfo') ? req.param('contactInfo') : "",
          integerOpenTime: req.param('openTime') ? parseInt(req.param('openTime')) : 6*60*60,
          integerCloseTime: req.param('closeTime') ? parseInt(req.param('closeTime')) : 23*60*60,
          integerMaxWaitingTime: req.param('maxWaitingTime') ? parseInt(req.param('maxWaitingTime')) : 5*60,
          stringLogLevel: req.param('logLevel') ? req.param('logLevel') : 'info',
          integerMaxRequestPerEmployee: req.param('maxRequestPerEmployee') ? parseInt(req.param('maxRequestPerEmployee')) : 0,
          integerMaxRequestTimeout: req.param('maxRequestTimeout') ? parseInt(req.param('maxRequestTimeout')) : 0,
          stringSuser: req.param('suser') ? req.param('suser') : "shopdummy", // default shop user
          stringSpwd: req.param('spwd') ? req.param('spwd') : "needupdate",
          integerRequestTtl: req.param('requestTtl') ? parseInt(req.param('requestTtl')) : 0,
        });
        if (result.status === true) {
          let encodedSpwd = base64.encode(result.data.spwd);
          result.data.spwd = encodedSpwd;
          sails.log("creating new shopinfo, suser " + result.data.suser + " spwd " + result.data.spwd);

          ShopInfo.create(result.data).exec(function(err, shop) {
            if (err) {
              return res.json(err.status, { err: err });
            }
            if (shop) {
              delete shop.spwd;
              res.json(generateResultService.success({ data: shop }));
              LiveCusReqs.updateAutocloseConfig(shop.requestTtl);
              PublicServerUtils.sendNewShopInfo(shop);
            } else {
              return res.serverError("Could not create new shopinfo");
            }
          })
        } else {
          return res.badRequest(generateResultService.fail(result.message));
        }
      }
    });
  },

  showShopInfo: function(req, res) {
    //sails.log("Calling " + arguments.callee.name + " from " + __filename);

    ShopInfo.find({
      limit: 1,
    }).exec(function(err, ashop) {
      if (err) return res.serverError(err);
      
      for (let i = 0; i < ashop.length; i++) {
        delete ashop[i].spwd;
      }
      return res.json(generateResultService.success({ total: ashop.length, data: ashop }));
    });
  },

  updateShopInfo: function(req, res) {
    //sails.log("Calling " + arguments.callee.name + " from " + __filename);
    if (_.isUndefined(req.params['id'])) {
      return res.badRequest(generateResultService.fail('id is required'));
    }
    // sails.log("Raw request ttl: in body " + req.param('requestTtl') + ", in path " + req.params['requestTtl'] + ", typeof requestTtl " + typeof(req.param('requestTtl')));

    ShopInfo.findOne({ id: req.params['id'] }).exec(function(err, shop) {
      if (err) { return res.serverError(err); }
      if (!shop) { return res.badRequest(generateResultService.fail('This shop does not exist')); }

      let result = validation.check({
        stringShopName: req.param('shopName') ? req.param('shopName') : shop.shopName,
        stringAddress: req.param('address') ? req.param('address') : shop.address,
        stringContactInfo: req.param('contactInfo') ? req.param('contactInfo') : shop.contactInfo,
        integerOpenTime: req.param('openTime') ? parseInt(req.param('openTime')) : shop.openTime,
        integerCloseTime: req.param('closeTime') ? parseInt(req.param('closeTime')) : shop.closeTime,
        integerMaxWaitingTime: req.param('maxWaitingTime') ? parseInt(req.param('maxWaitingTime')) : shop.maxWaitingTime,
        stringLogLevel: req.param('logLevel') ? req.param('logLevel') : shop.logLevel,
        integerMaxRequestPerEmployee: req.param('maxRequestPerEmployee') ? parseInt(req.param('maxRequestPerEmployee')) : shop.maxRequestPerEmployee,
        integerMaxRequestTimeout: req.param('maxRequestTimeout') ? parseInt(req.param('maxRequestTimeout')) : shop.maxRequestTimeout,
        integerRequestTtl: req.param('requestTtl') || req.param('requestTtl')===0 ? parseInt(req.param('requestTtl')) : shop.requestTtl,
      });
      if (result.status === true) {
        ShopInfo.update({ id: shop.id }, result.data).exec(function(err, shop) {
          if (err) {
            return res.json(err.status, { err: err });
          }
          sails.log("total item of shop ", shop.length);
          if (shop) {
            for (let i = 0; i < shop.length; i++) {
              delete shop[i].spwd;
            }
            res.json(generateResultService.success({ total: shop.length, data: shop }));
            if (shop.length) {
              LiveCusReqs.updateAutocloseConfig(shop[0].requestTtl);
              PublicServerUtils.sendUpdatedShopInfo(shop[0]);
            }
          } else {
            return res.serverError("Could not update shopinfo record"); // TODO: apply this fix for all other controller
          }
        });
      } else {
        return res.badRequest(generateResultService.fail(result.message))
      }
    });
  },

  updateSyncAccountPwd: function(req, res) {
    //sails.log("Calling " + arguments.callee.name + " from " + __filename);
    let suser = req.param('suser');
    let oldSpwd = req.param('oldSpwd');
    let newSpwd = req.param('newSpwd');
    if (_.isUndefined(suser)) {
      return res.badRequest(generateResultService.fail('suser is required'));
    }
    if (_.isUndefined(oldSpwd)) {
      return res.badRequest(generateResultService.fail('oldSpwd is required'));
    }
    if (_.isUndefined(newSpwd)) {
      return res.badRequest(generateResultService.fail('newSpwd is required'));
    }

    ShopInfo.findOne({ suser: suser }).exec(async function(foundErr, foundShop) {
      if (foundErr) { return res.serverError(foundErr); }
      if (!foundShop) { return res.badRequest(generateResultService.fail('This shop does not exist')); }

      // sails.log("Requesting to change spwd for " + suser + " from " + oldSpwd + " to " + newSpwd);
      sails.log("Requesting to change spwd for " + suser);

      // Compare oldSpwd with current spwd in DB. If passed: do update
      let encodedOldSpwd = base64.encode(oldSpwd);
      if (encodedOldSpwd !== foundShop.spwd) {
        return res.badRequest(generateResultService.fail('old password is incorrect'));
      }

      // store new spwd to db
      ShopInfo.update({ suser: suser }, {spwd: base64.encode(newSpwd)}).exec(function(updatedErr, updatedShop) {
        if (updatedErr) { return res.serverError(updatedErr); }
        if (updatedShop) {
          for (let i = 0; i < updatedShop.length; i++) {
            delete updatedShop[i].spwd;
          }
          return res.json(generateResultService.success({ total: updatedShop.length, data: updatedShop }));
        } else {
          return res.serverError("Could not update spwd to db");
        }
      });
    });
  },

  updateSyncAccount: function(req, res) {
    //sails.log("Calling " + arguments.callee.name + " from " + __filename);
    let oldSuser = req.param('oldSuser');
    let newSuser = req.param('newSuser');
    let oldSpwd = req.param('oldSpwd');
    let newSpwd = req.param('newSpwd');
    if (_.isUndefined(oldSuser)) {
      return res.badRequest(generateResultService.fail('oldSuser is required'));
    }
    if (_.isUndefined(newSuser)) {
      return res.badRequest(generateResultService.fail('newSuser is required'));
    }
    if (_.isUndefined(oldSpwd)) {
      return res.badRequest(generateResultService.fail('oldSpwd is required'));
    }
    if (_.isUndefined(newSpwd)) {
      return res.badRequest(generateResultService.fail('newSpwd is required'));
    }

    ShopInfo.findOne({ suser: oldSuser }).exec(async function(foundErr, foundShop) {
      if (foundErr) { return res.serverError(foundErr); }
      if (!foundShop) { return res.badRequest(generateResultService.fail('This shop does not exist')); }

      // sails.log("Requesting to change sync account from " + oldSuser + "/" + oldSpwd + " to " + newSuser + "/" + newSpwd);
      sails.log("Requesting to change sync account");

      // Compare oldSpwd with current spwd in DB. If passed: do update
      let encodedOldSpwd = base64.encode(oldSpwd);
      if (encodedOldSpwd !== foundShop.spwd) {
        return res.badRequest(generateResultService.fail('old password is incorrect'));
      }

      // store new sync account to db
      ShopInfo.update({ suser: oldSuser }, {suser: newSuser, spwd: base64.encode(newSpwd)}).exec(function(updatedErr, updatedShop) {
        if (updatedErr) { return res.serverError(updatedErr); }
        if (updatedShop) {
          for (let i = 0; i < updatedShop.length; i++) {
            delete updatedShop[i].spwd;
          }
          return res.json(generateResultService.success({ total: updatedShop.length, data: updatedShop }));
        } else {
          return res.serverError("Could not update sync account to db");
        }
      });
    });
  }
};
