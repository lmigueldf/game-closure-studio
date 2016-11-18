var EventEmitter = require('events').EventEmitter;
var path = require('path');
var pathExtra = require('path-extra');
var fs = require('fs');
var crypto = require('crypto');

var copy = require('../util/copy');
var mkdirp = Promise.promisify(require('mkdirp')); // mkdir -p

var gitClient = require('../util/gitClient');
var Module = require('../apps/Module');
var logger = require('../util/logging').get('cache');
var rimraf = require('../util/rimraf');

function randomName() {
  return '' + crypto.randomBytes(4).readUInt32LE(0)
    + crypto.randomBytes(4).readUInt32LE(0);
}

var MODULE_CACHE = path.join(__dirname, '../../../', 'cache');//path.join(pathExtra.datadir(process.title), 'cache');
var DEFAULT_URL = 'https://github.com/gameclosure/';

var ModuleCache = Class(EventEmitter, function () {

  this.init = function () {
    EventEmitter.call(this);

    if (!fs.existsSync(MODULE_CACHE)) {
      fs.mkdirSync(MODULE_CACHE);
    }

    this._isLoaded = false;
    this._entries = {};

    var entryNames = fs.readdirSync(MODULE_CACHE);
    Promise.bind(this).return(entryNames).map(function (entry) {
      var cachePath = this.getPath(entry);
      return getCachedModuleInfo(cachePath);
    }).reduce(function (entries, entry) {
      entry && entry.name && (entries[entry.name] = entry);
      return entries;
    }, {}).then(function (entries) {
      this._entries = entries;
      this._isLoaded = true;
      this.emit('loaded');
    });
  };

  this.getPath = function () {
    if (arguments.length) {
      return path.join(MODULE_CACHE, path.join.apply(path, arguments));
    }

    return MODULE_CACHE;
  };

  function getCachedModuleInfo (cachePath, cb) {
    var git = gitClient.get(cachePath, {extraSilent: true});

    return Promise.all([
      git.getLatestLocalTag(),
      git.getCurrentHead(),
      git('show', 'HEAD:package.json'),
      Module.getURL(cachePath)
    ]).all().spread(function (tag, head, pkg, url) {
      var version = tag || head;
      var data = JSON.parse(pkg);

      return {
        url: url,
        name: data.name,
        version: version
      };
    }).nodeify(cb);
  }

  this.convertTempModulePath = function (cachePath, moduleName) {
    var targetPath = this.getPath(moduleName);
    if (targetPath !== cachePath && !fs.existsSync(targetPath)) {
      fs.renameSync(cachePath, targetPath);
    }
  }

  var PROTOCOL = /^[a-z][a-z0-9+\-\.]*:/;
  var SSH_URL = /.+?\@.+?:.+/;

  /**
   * add module to cache. If version omitted, fetch latest version
   *
   * @param {string} nameOrUrl
   * @param {string} [version]
   * @param {function} cb
   */

  this.add = function (nameOrURL, version, cb) {
    trace('cache.add name:', nameOrURL, 'version:', version);
    var self = this;
    var tempName = this.getPath(randomName());

    return Promise.resolve(void 0).bind(this).then(function () {
      if (!this._isLoaded) {
        var self = this;
        trace('waiting for module cache to load');
        return new Promise(function (resolve) {
          self.once('loaded', resolve);
        });
      }
      return void 0;
    }).then(function () {
      trace('module cache loaded');
      var entry = this._get(nameOrURL);
      if (entry) {
        trace('have entry, returning [entry, Promise for setVersion]');
        // if we already have the repo cloned, just set the requested version
        // or the latest version
        return [
          entry,
          Module.setVersion(this.getPath(entry.name), version)
        ];
      }

      return [];
    }).all().spread(function (entry, newVersion) {
      if (entry) {
        trace('updated entry', entry, 'to version', version);
        // return the cache info with the version we just set
        entry.version = version;
        return entry;
      } else {
        trace('module not cached; get it.');
        // clone the repo and add it to the cache.
        return this.addNewModuleFromRemote(
          nameOrURL, version, tempName
        ).then(function (entry) {
          return entry;
        });
      }
    }).nodeify(cb);
  };

  this.addNewModuleFromRemote = function (nameOrURL, version, tempName, cb) {
    var url = nameOrURL;
    if (!PROTOCOL.test(nameOrURL) && !SSH_URL.test(nameOrURL)) {
      // try the default URL + name scheme
      url = DEFAULT_URL + nameOrURL;
    }
    var git = gitClient.get(MODULE_CACHE);
    return git('clone', url, tempName, {
      silent: false,
      buffer: false,
      stdio: 'inherit'
    }).bind(this).then(function () {
      // Ensure we are on the correct version of the module.
      return Module.setVersion(tempName, version);
    }).then(function (newVersion) {
      // Get module metadata
      return getCachedModuleInfo(tempName);
    }).then(function (entry) {
      // Move module to correct location
      this.convertTempModulePath(tempName, entry.name);
      return entry;
    }).finally(function () {
      return rimraf(tempName);
    }).nodeify(cb);
  };

  this.remove = function (name, cb) {
    return rimraf(this.getPath(name), cb);
  };

  this.copy = function (cacheEntry, destPath, cb) {
    var srcPath = this.getPath(cacheEntry.name) + path.sep;
    var copyTo = path.join(destPath, cacheEntry.name) + path.sep;

    logger.log('installing', cacheEntry.name, 'at', copyTo);

    return mkdirp(copyTo).then(function () {
      return copy.path(srcPath, copyTo);
    }).nodeify(cb);
  };

  this.link = function (cacheEntry, destPath, cb) {
    var src = this.getPath(cacheEntry.name);
    var dest = path.join(destPath, cacheEntry.name);
    return createLink(src, dest, cb);
  };

  this.has = function (nameOrURL) {
    return !!this._get(nameOrURL);
  };

  function cleanURL(url) {
    trace('cleanURL', url);
    return url.split('#', 1)[0].replace(/(?:\.git)?\/?$/, '');
  }

  this._get = function (nameOrURL) {
    // ignore versions and trailing slashes for matching against URLs
    var testURL = cleanURL(nameOrURL);
    for (var name in this._entries) {
      if (name === nameOrURL || cleanURL(this._entries[name].url) === testURL) {
        return this._entries[name];
      }
    }
  };
});

var unlink = Promise.promisify(fs.unlink);
var symlink = Promise.promisify(fs.symlink);
var lstat = Promise.promisify(fs.lstat);

function createLink(src, dest, cb) {
  return lstat(dest).catch(function (err) {
    if (err.code !== 'ENOENT') {
      return Promise.reject(err);
    }
  }).then(function (stat) {
    if (stat) {
      if (stat.isSymbolicLink()) {
        return unlink(dest);
      } else {
        return Promise.reject(
          new Error('Please remove existing module before using --link')
        );
      }
    }
  }).then(function () {
    return symlink(src, dest, 'junction');
  }).nodeify(cb);
}

module.exports = new ModuleCache();
module.exports.CACHE_PATH = MODULE_CACHE;
