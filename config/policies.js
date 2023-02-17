/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#!/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.policies.html
 */



module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions (`true` allows public     *
  * access)                                                                  *
  *                                                                          *
  ***************************************************************************/
    '*' :'isAuthorized',

    'AuthController': {
        'create': true, // allowing public access
        'logout':   ['isAuthorized'],
    },

    // TODO: critical security case
    //   * Receptionist can create a new Admin and perform all action with that admin account!!!
    // SOLUTION:
    //   * Every role can only create/update/delete user has role no greater than his role
    'UserController': {
        'create':   ['isAuthorized','isReceptionistOrHigher'],
        'update':   ['isAuthorized','isReceptionistOrHigher'],
        'delete':   ['isAuthorized','isReceptionistOrHigher'],
        'findAll':  ['isAuthorized','isReceptionistOrHigher'],
        'getProfile':  ['isAuthorized','isReceptionistOrHigher'],
        'getMyProfile':  ['isAuthorized'],
        'changePassword':  ['isAuthorized'],
    },

    'ShopInfoController': {
        'createShopInfo':           ['isAuthorized', 'isAdmin'],
        'showShopInfo':             ['isAuthorized'],
        'updateShopInfo':           ['isAuthorized', 'isAdmin'],
        'updateSyncAccountPwd':     ['isAuthorized', 'isAdmin'],
        'updateSyncAccount':        ['isAuthorized', 'isAdmin'],
    },

    'XcallerController': {
        'createXcaller':    ['isAuthorized', 'isAdmin'],
        'getAllXcallers':   ['isAuthorized'],
        'getOneXcaller':    ['isAuthorized'],
        'updateXcaller':    ['isAuthorized', 'isAdmin'],
        'deleteXcaller':    ['isAuthorized', 'isAdmin'],
        'addXcaller':       ['isAuthorized', 'isAdmin'],
        'getBatteryStatus': ['isAuthorized', 'isAdmin'],
        'updateBatteryStatus':['isAuthorized', 'isAdmin'], // TODO: this one will be only called by system, admin should never call this
        'assignTable':      ['isAuthorized', 'isReceptionistOrHigher'],
        'removeTable':      ['isAuthorized', 'isReceptionistOrHigher'],
    },

    'BatteryController': {
        'getBatterySetting':    ['isAuthorized', 'isAdmin'],
        'setAlertThreshold':    ['isAuthorized', 'isAdmin'],
    },

    'WorkSessionController': {
        'createSession':    ['isAuthorized', 'isReceptionistOrHigher'],
        'getSessions':      ['isAuthorized'],
        'getSession':       ['isAuthorized'],
        'updateSession':    ['isAuthorized', 'isReceptionistOrHigher'],
        'deleteSession':    ['isAuthorized', 'isReceptionistOrHigher'],
        'assignWorkSession': ['isAuthorized','isReceptionistOrHigher'],
        'removeWorkSession': ['isAuthorized','isReceptionistOrHigher'],
    },

    'CustomerRequestController': {
        'createRequest':        ['isAuthorized', 'isReceptionistOrHigher'],
        'getAllRequestsPage':   ['isAuthorized', 'isReceptionistOrHigher'],
        'getRequestsFromRequestId': ['isAuthorized', 'isReceptionistOrHigher'],
        'getUniqReqPerXcaller': ['isAuthorized'],
        'getRequest':           ['isAuthorized'],
        'updateRequestStatus':  ['isAuthorized'],
        'updateAssignee':       ['isAuthorized', 'isReceptionistOrHigher'],
        'deleteRequest':        ['isAuthorized', 'isReceptionistOrHigher'],
        'closeLastRequest':     ['isAuthorized', 'isReceptionistOrHigher'],
    },

    'TimesheetController': {
        // 'createTimesheet':      ['isAuthorized', 'isReceptionistOrHigher'],
        // 'updateTimesheet':      ['isAuthorized', 'isReceptionistOrHigher'],
        // 'deleteTimesheet':      ['isAuthorized', 'isReceptionistOrHigher'],
        'getTimesheet':         ['isAuthorized', 'isReceptionistOrHigher'],
        'getAllTimesheets':     ['isAuthorized', 'isReceptionistOrHigher'],
    },

    'ActivitiesLoggingController': {
        'getActivities':        ['isAuthorized', 'isReceptionistOrHigher'],
    },

    'StatisticsDayController': {
        'getStatisticsByDay':   ['isAuthorized', 'isReceptionistOrHigher'],
    },

    'StatisticsHourController': {
        'getStatisticsByHour':   ['isAuthorized', 'isReceptionistOrHigher'],
    },



  /***************************************************************************
  *                                                                          *
  * Here's an example of mapping some policies to run before a controller    *
  * and its actions                                                          *
  *                                                                          *
  ***************************************************************************/
	// RabbitController: {

		// Apply the `false` policy as the default for all of RabbitController's actions
		// (`false` prevents all access, which ensures that nothing bad happens to our rabbits)
		// '*': false,

		// For the action `nurture`, apply the 'isRabbitMother' policy
		// (this overrides `false` above)
		// nurture	: 'isRabbitMother',

		// Apply the `isNiceToAnimals` AND `hasRabbitFood` policies
		// before letting any users feed our rabbits
		// feed : ['isNiceToAnimals', 'hasRabbitFood']
	// }
};

