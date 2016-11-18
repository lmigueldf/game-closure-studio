var base = require('jsio.base');
GLOBAL.Class = base.Class;
GLOBAL.merge = base.merge;
GLOBAL.bind = base.bind;
// catch SIGTERM and SIGINT so `exit` events properly trigger on the process
// object (e.g. killing child processes)
process.on('SIGTERM', function () {
  process.exit(1);
});

process.on('SIGINT', function () {
  process.exit(2);
});

if (process.env.DEVKIT_TRACE) {
  trace = function devkitTrace () {
    console.log.apply(console, arguments);
  };

  process.env.BLUEBIRD_DEBUG = 1;
} else {
  trace = function () {};
}

Promise = require('bluebird');

/**
 * Show devkit trace information
 */
var version = require(__dirname + '/../package.json').version;
trace('--------------------------------------------------------------------------------');
trace('------------------------- GAME CLOSURE DEVKIT TRACE ----------------------------');
trace('--------------------------------------------------------------------------------');
trace('  VERSION =>', version, '\n\n');

