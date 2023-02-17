/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {
  
  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': {
    view: 'homepageold'
  },

  /**
   * API USER
   */
  // TODO: longnkh: when call CREATE new user, client must encrypt password before sending
  'POST /api/user':                 'UserController.create',
  'PUT /api/user/:id':              'UserController.update',
  'POST /api/authorization':        'AuthController.create',
  'POST /api/logout':               'AuthController.logout',
  'POST /api/user/change_password': 'UserController.changePassword',
  'DELETE /api/user/:id':           'UserController.delete',
  'GET /api/users':                 'UserController.findAll',
  'GET /api/user/:id':              'UserController.getProfile',
  'GET /api/my-profile':            'UserController.getMyProfile',

  // ShopInfo
  'POST /api/shopinfo':     'ShopInfoController.createShopInfo',
  'GET /api/shopinfo':      'ShopInfoController.showShopInfo',
  'PUT /api/shopinfo/:id':  'ShopInfoController.updateShopInfo', // TODO: remove id from this API
  'PUT /api/shoppwd':       'ShopInfoController.updateSyncAccountPwd',
  'PUT /api/shopsacc':      'ShopInfoController.updateSyncAccount',

  // X-Caller Device
  'POST /api/xcaller':      'XcallerController.createXcaller',
  'GET /api/xcallers':      'XcallerController.getAllXcallers',
  'GET /api/xcaller/:id':   'XcallerController.getOneXcaller',
  'PUT /api/xcaller/:id':   'XcallerController.updateXcaller',
  'DELETE /api/xcaller/:id': 'XcallerController.deleteXcaller',
  'POST /api/assign-table':  'XcallerController.assignTable',
  'POST /api/remove-table':  'XcallerController.removeTable',
  'POST /api/add-xcaller':   'XcallerController.addXcaller',

  // Battery info
  'GET /api/batteryStatus/:id':         'XcallerController.getOneXcaller',
  'PUT /api/batteryStatus/:id':         'XcallerController.updateBatteryStatus',
  'GET /api/batterySetting':            'BatteryController.getBatterySetting',
  'PUT /api/updateBatterySetting':      'BatteryController.setAlertThreshold',

  // Work Session
  'POST /api/session':      'WorkSessionController.createSession',
  'GET /api/sessions':      'WorkSessionController.getSessions',
  'GET /api/session/:id':   'WorkSessionController.getSession',
  'PUT /api/session/:id':   'WorkSessionController.updateSession',
  'DELETE /api/session/:id': 'WorkSessionController.deleteSession',
  'POST /api/assign-work-session':  'WorkSessionController.assignWorkSession',
  'POST /api/remove-work-session':  'WorkSessionController.removeWorkSession',

  // Operations / Customer Requests
  'POST /api/request':                          'CustomerRequestController.createRequest',
  'GET /api/test-newer-requests/:requestid':    'CustomerRequestController.getRequestsFromRequestId',
  'GET /api/test-all-requests':                 'CustomerRequestController.getAllRequestsPage',
  'GET /api/all-requests':                      'CustomerRequestController.getUniqReqPerXcaller',
  'GET /api/request/:id':                       'CustomerRequestController.getRequest',
  'DELETE /api/request/:id':                    'CustomerRequestController.deleteRequest',
  'PUT /api/close-last-request/:xcallerId':     'CustomerRequestController.closeLastRequest',
  'PUT /api/update-req-status/:id':             'CustomerRequestController.updateRequestStatus',
  'PUT /api/update-req-assignee/:id':           'CustomerRequestController.updateAssignee',

  // Timesheet
  // 'POST /api/timesheets':       'TimesheetController.createTimesheet',
  // 'PUT /api/timesheets/:id':    'TimesheetController.updateTimesheet',
  // 'DELETE /api/timesheets/:id': 'TimesheetController.deleteTimesheet',
  'GET /api/timesheets/:id':    'TimesheetController.getTimesheet',
  'GET /api/timesheets':        'TimesheetController.getAllTimesheets',

  // Activities Logging
  'GET /api/activities':        'ActivitiesLoggingController.getActivities',

  // Statistics
  'GET /api/statistics':  'StatisticsDayController.getStatisticsByDay',
  'GET /api/hourly-statistics': 'StatisticsHourController.getStatisticsByHour',

};
