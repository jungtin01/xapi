module.exports = {

  // Cache from db
  // key: user id
  // value: latest datesod for that user
  latestTimesheet: {},

  loadTimesheets: async function() {
    sails.log("Loading timesheets...");
    let today = new Date(); // new Date() will be called multiple times for all users (or all requests). Should create a global timer and use it?
    let sod = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()); // global sod for each user
    let timesheets = await Timesheet.find({
      where: {
        datesod: {'>=' : sod},
      },
      // sort: 'id DESC',
    });

    sails.log("Total timesheets: " + timesheets.length);
    for (let i = 0; i < timesheets.length; i++) {
      // console.log("timesheet ", i, timesheets[i]);
      let userId = timesheets[i].userId;
      if (!TimesheetUtils.latestTimesheet.hasOwnProperty(userId)) {
        sails.log("First time set timesheet " + i + " for user " + userId);
        TimesheetUtils.latestTimesheet[userId] = timesheets[i];
      } else {
        if (timesheets[i].datesod > TimesheetUtils.latestTimesheet[userId].datesod) {
          sails.log("Updated timesheet " + i + " for user " + userId);
          TimesheetUtils.latestTimesheet[userId] = timesheets[i];
        }
      }
    }
    sails.log("Loaded timesheets", Object.keys(TimesheetUtils.latestTimesheet));

    // TODO: should have global datesod per user here, with that we can possibly support multiple working sessions for each user
  },

  pickTimesheetDatesod: function(options) {
    // options: {userid: id, daytime: today datetime}
    
    const NEW_TIMESHEET_THRESHOLD = 3 * 3600 * 1000;
    // const NEW_TIMESHEET_THRESHOLD = 0 * 3600 * 1000 + 2 * 60 * 1000; //3 * 3600 * 1000
    let userId = options.userId;
    let daytime = options.daytime;
    sails.log("Getting timesheet datesod for user " + userId);
    if (!TimesheetUtils.latestTimesheet.hasOwnProperty(userId)) {
      // First time login
      sails.log("First time login to system, userid " + userId);
      return Date.UTC(daytime.getFullYear(), daytime.getMonth(), daytime.getDate());
    } else {
      now = daytime.getTime();
      // Relogin to the system
      if (TimesheetUtils.latestTimesheet[userId].outTime > TimesheetUtils.latestTimesheet[userId].inTime &&
        (now  - TimesheetUtils.latestTimesheet[userId].outTime) > NEW_TIMESHEET_THRESHOLD) {
          sails.log("Create more timesheet for " + userId);
          return TimesheetUtils.latestTimesheet[userId].datesod + 1; // create new timesheet
      } else {
        sails.log("Existing timesheet for userid " + userId);
        return TimesheetUtils.latestTimesheet[userId].datesod;
      }
    }
  },

  formatTimesheet: function(timesheet) {
    // console.log("Formatting timesheet ", timesheet);
    if (!timesheet.datesod || !timesheet.inTime || !timesheet.outTime) {
      sails.log("Invalid timesheet record " + JSON.stringify(timesheet));
      return;
    }
    timesheet.workedHours = (timesheet.outTime - timesheet.inTime) / 1000 / 3600;
    timesheet.datesod = (new Date(timesheet.datesod)).toISOString().substr(0,10);
    timesheet.inTime = (new Date(timesheet.inTime)).toLocaleTimeString();
    timesheet.outTime = (new Date(timesheet.outTime)).toLocaleTimeString();
    delete timesheet.createdAt;
    delete timesheet.updatedAt;
    // console.log("Formatted timesheet ", timesheet);
  },

  formatTimesheets: function(timesheets) {
    // timesheets: list of timesheet
    for (let i = 0; i < timesheets.length; i++) {
      TimesheetUtils.formatTimesheet(timesheets[i]);
    }
  },

  createNewTimesheet: function(options) {
    // precondition: when this function is called, we assumed that the user was already valid
    // options: {userid: id, datesod: epoch sod}

    Timesheet.findOne({
      where: {
        userId: options.userId,
        datesod: options.datesod,
      }
    }).exec(function(err, timesheet) {
      if (err) {
        return sails.log.error("Finding timesheet error for " + JSON.stringify(options) + ". Err: " + err);
      }
      if (timesheet) {
        // already existed, do nothing
        return;
      }

      // create new timesheet for this user
      let lastReqTimeEpoch = UserUtils.users[options.userId].lastReqTime.getTime();
      Timesheet.create({
        userId: options.userId,
        datesod: options.datesod,
        inTime: lastReqTimeEpoch,
        outTime: lastReqTimeEpoch,
      }).exec(function(err, newTimesheet) {
        if (err) {
          return sails.log.error("Creating new timesheet error for " + JSON.stringify(options) + ". Err: " + err);
        }
        if (newTimesheet) {
          sails.log("Successfully created new timesheet for userid " + options.userId + " datesod " + options.datesod);
          TimesheetUtils.latestTimesheet[options.userId] = newTimesheet;
          console.log("New timesheet for userId ", options.userId, TimesheetUtils.latestTimesheet[options.userId]);
        } else {
          sails.log("Could not create new timesheet for " + JSON.stringify(options));
        }
      });
    });
  },

  updateOutTimesheet: function(options) {
    // precondition: when this function is called, we assumed that the user was already valid
    // options: {userid: id, datesod: epoch sod, outTime: epoch outTime}

    // sails.log("updateOutTimesheet " + JSON.stringify(options));

    // update outTime for this user
    Timesheet.update({ userId: options.userId, datesod: options.datesod }, { outTime: options.outTime }).exec(function(err, updatedTimesheets) {
      if (err) {
        return sails.log.error("Updating timesheet error for " + JSON.stringify(options) + ". Err: " + err);
      }
      if (!updatedTimesheets) {
        return sails.log.error("Could not update timesheet for " + JSON.stringify(options));
      }
      
      if (updatedTimesheets.length > 0) {
        // sails.log("Updated timesheet " + JSON.stringify(updatedTimesheets));
        sails.log("Successfully updated outTime for userid " + options.userId + " datesod " + options.datesod + " to " + options.outTime);
        TimesheetUtils.latestTimesheet[options.userId].outTime = options.outTime;
        console.log("Updated timesheet for userId ", options.userId, TimesheetUtils.latestTimesheet[options.userId]);
      } else {
        return sails.log.error("No timesheet updated for " + JSON.stringify(options));
      }
    });
  }

};