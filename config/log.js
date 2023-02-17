/**
 * Built-in Log Configuration
 * (sails.config.log)
 *
 * Configure the log level for your app, as well as the transport
 * (Underneath the covers, Sails uses Winston for logging, which
 * allows for some pretty neat custom transports/adapters for log messages)
 *
 * For more information on the Sails logger, check out:
 * http://sailsjs.org/#!/documentation/concepts/Logging
 */

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;
const { SPLAT } = require('triple-beam');
require('winston-daily-rotate-file');
var moment = require('moment-timezone');

/*
  Winston logging levels: highest --> lowest
  {
    emerg: 0, 
    alert: 1, 
    crit: 2, 
    error: 3, 
    warning: 4, 
    notice: 5, 
    info: 6, 
    debug: 7
  }
  If logging level is set X, it is the maximum level of messages will be displayed
  e.g: logging level = info, so all logs from emerg to info will be displayed

  If Winston logging level is not set, npm logging level will be used
  { 
    error: 0, 
    warn: 1, 
    info: 2, 
    verbose: 3, 
    debug: 4, 
    silly: 5 
  }
*/

var loggingOptions = {
  debugFile: {
    level: 'debug',
    name: 'file.debug',
    filename: 'f_debug.log',
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 100,
    colorize: false,
  },
  errorFile: {
    level: 'error',
    name: 'file.error',
    filename: 'f_error.log',
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 100,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: false,
  },
  // winston-daily-rotate-file
  dailyFile: {
    level: 'debug',
    filename: 'xcaller-%DATE%.log',
    handleExceptions: true,
    dirname: './logs',
    datePattern: 'YYMMDD',
    zippedArchive: true,
    maxSize: '5m',
    maxFiles: '365d'
  },
};

// work-around for winston 3.x issue
// https://github.com/winstonjs/winston/issues/1427#issuecomment-427104223
function formatObject(param) {
  if (_.isObject(param)) {
    return JSON.stringify(param);
  }
  return param;
}
// Ignore log messages if they have { private: true }
const all = format((info) => {
  const splat = info[SPLAT] || [];
  const message = formatObject(info.message);
  const rest = splat.map(formatObject).join(' ');
  info.message = `${message} ${rest}`;
  return info;
});

const localtimeFormat = format((info, opts) => {
  if(opts.tz)
    info.timestamp = moment().tz(opts.tz).format('HH:mm:ss.SSS');
    // info.timestamp = new Date(Date.now() - new Date().getTimezoneOffset()*60*1000).toISOString();
  return info;
});

const logger = createLogger({
  format: combine(
    all(),
    // timestamp(),
    // label({ label: __filename }),
    localtimeFormat({ tz: 'Asia/Ho_Chi_Minh' }),
    printf(info => `${info.timestamp} ${info.level}: ${formatObject(info.message)}`)
  ),
  
  // format without the workaround for winston 3.x issue
  // format: combine(
  //   // label({ label: 'set-label-here' }),
  //   timestamp(),
  //   printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  // ),
  transports: [
      new (transports.Console)(loggingOptions.console)
    // , new (transports.File)(loggingOptions.errorFile)
    // , new (transports.File)(loggingOptions.debugFile)
    , new (transports.DailyRotateFile)(loggingOptions.dailyFile)
  ]
});

// TODO: use dynamical logging for sandbox env
// if (process.env.NODE_ENV !== 'production') {
//   logger.add(new winston.transports.Console({
//     loggingOptions.console
//   }));
// }


module.exports.log = {
  /***************************************************************************
  *                                                                          *
  * Valid `level` configs: i.e. the minimum log level to capture with        *
  * sails.log.*()                                                            *
  *                                                                          *
  * The order of precedence for log levels from lowest to highest is:        *
  * silly, verbose, info, debug, warn, error                                 *
  *                                                                          *
  * You may also set the level to "silent" to suppress all logs.             *
  *                                                                          *
  ***************************************************************************/
  // Pass in our custom logger, and pass all log levels through.
  custom: logger,
  // level: 'info',

  // Disable captain's log so it doesn't prefix or stringify our meta data.
  inspect: false  // TODO: we should disable this option to completely disable captain-log.
                     // if not, 2 both logging are running: winston and captain-log
                  // but for now. winston 3.x have a bug that it can not accept for arguments in .log
                  // so, keep this `inspect: true` to enable argument in .log
                  // e.g: sails.log("username is %s", username); // output: username is %s
                  // but console.log("username is %s", username); // output: username is longnkh
                  // it means winston always accept the first argument, from 2nd argument, it completely ignores
                  // Workaround: use + for all logging. e.g: sails.log("username " + username + " password " + password);
                  // Another workaround: https://github.com/winstonjs/winston/issues/1427#issuecomment-427104223
};
