var config = {};

// TODO: these config can be updated easily on fill_up or take_off

// ---------
// base url
// ---------
config.PORT = 8008;
config.URL = "http://localhost:" + config.PORT;
config.URLLOGIN            =  config.URL + "/api/authorization";
config.URLMYPROFILE        =  config.URL + "/api/my-profile";
config.URLSTPTOKEN         =  config.URL + "/api/stp";
config.URLSTPMYSHOPINFO    =  config.URL + "/api/stp/my-shopinfo";
config.URLSTPCUSREQ        =  config.URL + "/api/stp/cusreq";


// ---------
// cron jobs
// ---------
config.STPTOKEN_SYNC_TIME = "5 1 */8 * * *"; // run every 8hrs
config.DEMO_PROFILE_TIME  = "0 1 */15 * * *"; // run every 15hrs
config.DAILY_DATA_STATS_SYNC_TIME = '0 23 23 * * *', // run daily at 23:23:00


// More configuration goes here
// ...

module.exports = config;
