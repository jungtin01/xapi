/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrapTimeout = 5000; // ms
module.exports.bootstrap = async function(cb) {

  // TODO: move user creation to UserUtils

  // Create User Admin
  sails.log("Finding admin user...");
  let foundUser = await User.findOne({username: 'admin'});
  if (foundUser) {
    sails.log("Admin is existed");
  } else {
    sails.log("Creating admin...");
    let newAdmin = await User.create({
      username: 'admin',
      password: '123456789',
      name:     'admin',
      status:   'active',
      isOnline:  false,
      role: 10,
      description: 'admin',
    });
    if (newAdmin) {
      sails.log("Created admin successfully");
    } else {
      return cb("Could not create admin!!!");
    }
  }

  // Create super admin
  sails.log("Finding super admin user...");
  foundUser = await User.findOne({username: 'sadmin'});
  if (foundUser) {
    sails.log("Super admin is existed");
  } else {
    sails.log("Creating super admin...");
    let newSuperAdmin = await User.create({
      username: 'sadmin',
      password: '3b1459ddb2104d116f46777e54247b92',
      name:     'sadmin',
      status:   'active',
      isOnline:  false,
      role: 10,
      description: 'Super Admin',
    });
    if (newSuperAdmin) {
      sails.log("Created super admin successfully");
    } else {
      return cb("Could not create super admin!!!");
    }
  }

  // Create receptionist
  sails.log("Finding receptionist user...");
  foundUser = await User.findOne({username: 'receptionist'});
  if (foundUser) {
    sails.log("Receptionist is existed");
  } else {
    sails.log("Creating receptionist...");
    let newReceptionist = await User.create({
      username: 'receptionist',
      password: '123456789',
      name:     'receptionist',
      status:   'active',
      isOnline:  false,
      role: 5,
      description: 'Receptionist',
    });
    if (newReceptionist) {
      sails.log("Created receptionist successfully");
    } else {
      return cb("Could not create receptionist!!!");
    }
  }

  // Sync account: SyncToPublic
  sails.log("Finding stp user...");
  foundUser = await User.findOne({username: 'stp'});
  if (foundUser) {
    sails.log("stp is existed");
  } else {
    sails.log("Creating stp...");
    let newStp = await User.create({
      username: 'stp',
      password: '0c1e3c327ded4c7c0fe854b0646487ecb2ae868e', // SHA-1 SyncToPublic
      name:     'stp',
      status:   'active',
      isOnline:  false,
      role: 5,  // TODO: do we need special user role STP
      description: 'stp',
    });
    if (newStp) {
      sails.log("Created stp successfully");
    } else {
      return cb("Could not create stp!!!");
    }
  }

  // NOTE:
  // Array (list) utils
  // let arrCurrent = []
  // arrCurrent.push('first item here'); // Add items to the end of an array
  // arrCurrent.push(2);
  // arrCurrent.push('3');
  // arrCurrent.push({});
  // arrCurrent.indexOf('k6'); // -1
  // arrCurrent.indexOf(2); // index of 2 in the in array
  // arrCurrent.push('add to tail'); // Add items to the end of an array
  // arrCurrent.unshift('add to head');        // Add items to the beginning of an array
  // arrCurrent.pop();      // Remove an item from the end of an array
  // arrCurrent.shift();    // Remove an item from the beginning of an array
  // arrCurrent = arrCurrent.filter(function(obj) { return obj }); // remove all null item from array
  
  // Dictionary utils
  // let dict = {}
  // dict.k1 = 1;
  // dict['k2'] = 2
  // Object.keys(dict);   // array of keys
  // Object.values(dict); // array of values
  // dict.hasOwnProperty('k1'); // true
  // dict.hasOwnProperty('k6'); // false
  // dict.includes('k6'); // false
  // dict.includes('k1'); // true
  
  // --------------
  // TODO: remeber to await these loading are completed if required
  // --------------

  // --------------
  // Load all users
  // --------------
  UserUtils.loadUsers();

  // ----------------
  // Load all devices
  // ----------------
  XcallerUtils.loadXcallers();

  // ----------------
  // Load timesheets
  // ----------------
  TimesheetUtils.loadTimesheets();

  // --------------
  // Load STP Stats
  // --------------
  StpStatsUtils.loadStpStats();

  // ---------------------
  // Load autoclose config
  // ---------------------
  LiveCusReqs.loadAutocloseConfig();

  // --------------------------
  // Load all customer requests
  // --------------------------
  let valLastMinutes = 120;
  let epochLastMinutes = Date.now() - valLastMinutes*60*1000;
  // sails.log("epoch last minutes: ", epochLastMinutes, new Date(epochLastMinutes));
  
  // TODO: refactor this code
  let devicesList = await Xcaller.find({}).populate('assignees', {select: ['id', 'username', 'isOnline']});
  if (!devicesList) {
    return cb("Could not get xcaller list on starting system!!!");
  } else {
    for (let i = 0; i < devicesList.length; i++) {
      // Build xcaller devices dictionary
      LiveCusReqs.devices[devicesList[i].xcallerId] = devicesList[i];

      responseData = await CustomerRequest.find({
        where: {
          createdAt: {'>=' : new Date(epochLastMinutes)},
          table: devicesList[i].id,
        },
        sort: 'id DESC'
      })
      .populate('table', {select: ['xcallerName', 'xcallerId']})
      .populate('owner', {select: ['username', 'name', 'status', 'isOnline']})
      .populate('proxies', {select: ['username', 'name', 'status', 'isOnline']});
  
      // Actually, the first item from the list responseData is the request we need, but to test getLatestRequests method
      // we still keep calling it here
      if (!responseData) {
        sails.log('Could not get latest request for xcaller id' + devicesList[i].id);
      } else {
        let newResponses = LiveCusReqs.getLatestRequests(responseData);
        if (newResponses[0] && newResponses[0].requestStatus !== 'C') {
          // LiveCusReqs.current[devicesList[i].xcallerId] = newResponses[0];
          LiveCusReqs.onUpdateLiveRequest(devicesList[i].xcallerId, newResponses[0], false); // on startup
        }
      }
    }
    sails.log("xcallers: ", Object.keys(LiveCusReqs.devices));
    // console.log("xcallers keys: ", Object.keys(LiveCusReqs.devices));

    sails.log("requests: ", Object.keys(LiveCusReqs.current));
    // console.log("requests arr: ", Object.values(LiveCusReqs.current));
  }

  // Create Battery obj
  let numBatteries = await Battery.count();
  if (numBatteries > 0) {
    sails.log('Existing Battery records:', numBatteries)
  } else {
    // Add Battery record to db
    sails.log("Creating Battery record...");
    let newBattery = await Battery.create({
      lowerLimit: 2.5,
      upperLimit: 3.5,
      alertThreshold: 3.0
    });
    if (newBattery) {
      sails.log("Created Battery setting successfully");
    } else {
      return cb("Could not create new Battery setting!!!");
    }
  }

  // TODO: should retry to connect every 1/2 seconds until got connected
  PublicServerUtils.getTokenToPulicServer(3);

  // TODO: create shopinfo on-start or fix front-end to check if data is available or not

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  return cb();
};
