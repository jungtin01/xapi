module.exports = {

  // Cache from db
  // key: record id - generated by db
  // value: record
  xcallers: {},

  // Cache from db
  // key: xcallerId
  // value: record
  xcallersById: {},

  AllowedAddingXcaller: false,

  loadXcallers: async function(options) {
    sails.log("Loading xcallers...");
    let xcallersList = await Xcaller.find({}).populate('assignees', {select: ['id', 'username', 'isOnline']});
    sails.log("Total xcallers: " + xcallersList.length);
    for (let i = 0; i < xcallersList.length; i++) {
      let id = xcallersList[i].id;
      XcallerUtils.xcallers[id] = xcallersList[i];

      let xcallerId = xcallersList[i].xcallerId;
      XcallerUtils.xcallersById[xcallerId] = xcallersList[i];
    }
    sails.log("Loaded xcallers", Object.keys(XcallerUtils.xcallers));
    // console.log("Loaded xcallers", XcallerUtils.xcallers);

    sails.log("Loaded xcallersById", Object.keys(XcallerUtils.xcallersById));
    // console.log("Loaded xcallersById", XcallerUtils.xcallersById);
  },

  updateXcaller: function(dbid, item) {
    sails.log("Updating xcaller " + dbid);
    // Update xcallers
    let oldXcallerId = undefined;
    if (!XcallerUtils.xcallers.hasOwnProperty(dbid)) {
      sails.log("Add new xcaller to list " + dbid);
    } else {
      sails.log("Update xcaller to list " + dbid);
      oldXcallerId = XcallerUtils.xcallers[dbid].xcallerId; // preserve to delete if required
    }
    XcallerUtils.xcallers[dbid] = item;

    // Update xcallersById
    let xcallerId = item.xcallerId;
    if (!XcallerUtils.xcallersById.hasOwnProperty(xcallerId)) {
      sails.log("Add new xcallerId to list " + xcallerId);
    } else {
      sails.log("Update xcallerId to list " + xcallerId);
    }
    XcallerUtils.xcallersById[xcallerId] = item;

    // delete old entry if key changes
    if (oldXcallerId !== xcallerId) {
      delete XcallerUtils.xcallersById[oldXcallerId];
      sails.log("Delete old xcallerId entry from list " + oldXcallerId);
    }

    sails.log("updateXcaller xcallers", XcallerUtils.xcallers);
    sails.log("updateXcaller xcallersById", XcallerUtils.xcallersById);

    // console.log("updateXcaller xcallers", XcallerUtils.xcallers);
    // console.log("updateXcaller xcallersById", XcallerUtils.xcallersById);
  },

  deleteXcaller: function(dbid) {
    sails.log("Deleting xcaller " + dbid);
    // Delete xcalelres
    let xcallerId = undefined;
    if (!XcallerUtils.xcallers.hasOwnProperty(dbid)) {
      sails.log("Xcaller " + dbid + " is not available, skip it");
    } else {
      sails.log("Delete xcaller " + dbid);
      xcallerId = XcallerUtils.xcallers[dbid].xcallerId;
      delete XcallerUtils.xcallers[dbid];
    }

    // Delete xcallersById
    if (!XcallerUtils.xcallersById.hasOwnProperty(xcallerId)) {
      sails.log("xcallerId " + xcallerId + " is not available, skip it");
    } else {
      sails.log("Delete xcallerId " + xcallerId);
      delete XcallerUtils.xcallersById[xcallerId];
    }

    sails.log("updateXcaller xcallers", XcallerUtils.xcallers);
    sails.log("updateXcaller xcallersById", XcallerUtils.xcallersById);

    console.log("updateXcaller xcallers", XcallerUtils.xcallers);
    console.log("updateXcaller xcallersById", XcallerUtils.xcallersById);
  },

  switchAddingXcaller: async function(options) {
    // options: {userid: id}
    sails.log("Switching adding xcaller feature to " + options.flag);
    XcallerUtils.AllowedAddingXcaller = options.flag;
  },

};