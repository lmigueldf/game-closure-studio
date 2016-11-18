var path = require('path');
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var printf = require('printf');
var os = require('os');
var open = require('open');
var apps = require('../apps');
var ip = require('../util/ip');
var logging = require('../util/logging');
var config = require('../config');
var jvmtools = require('../jvmtools');
var JsioCompiler = require('../build/jsio_compiler').JsioCompiler;
var stylus = require('./stylus');
var appRoutes = require('./appRoutes');
var BASE_PATH = path.join(__dirname, '..', '..');
// launches the web server
exports.serveWeb = function (opts, cb) {
  var basePort = opts.port;
  var app = opts.app || express();
  app.io = opts.sockets || require('socket.io')(server);
  app.use(function noCacheControl(req, res, next) {
    res.header('Cache-Control', 'no-cache');
    res.header('Expires', '-1');
    next();
  });
  app.use('/api/', getAPIRouter(merge({
    simulatorPort: basePort + 1,
    app: app
  }, opts)));
  // serve compiled CSS
  app.use('/', stylus(getPath('static')));
  // serve static files
  app.use('/', express.static(getPath('static')));
};
function getAPIRouter(opts) {
  var api = express();
  var send = require('send');
  api.get('/title', function (req, res) {
    var appPath = req.query.app;
    apps.get(appPath, {updateLastOpened: false}, function (err, app) {
      if (err) { return res.status(404).send(err); }
      // TODO: localized titles?
      res.status(200).send(app.manifest.title);
    })
  });
  api.get('/manifest', function (req, res) {
    var appPath = req.query.app;
    apps.get(appPath, {updateLastOpened: false}, function (err, app) {
      if (err) { return res.status(404).send(err); }
      res.send(app.manifest);
    });
  });
  // gets the ip of the server.
  // usage: make a GET request to /api/ip
  api.get('/ip', function (req, res) {
    res.json({ip: ip.getLocalIP()});
  });
  // a better js syntax checker
  api.use('/syntax', bodyParser.urlencoded({extended: true}));
  api.post('/syntax', function(req, res) {
    jvmtools.checkSyntax(req.body.javascript, function (err, syntaxErrors) {
      if (err) {
        res.send([false, err]);
      } else {
        res.send([true, syntaxErrors]);
      }
    });
  });
  // endpoint to retrive compiled javascript
  api.get('/compile/*', function (req, res) {
    var compiler = new JsioCompiler({
      env: 'browser',
      cwd: BASE_PATH,

      // add a trailing import statement so the JS executes the requested import
      // immediately when downloaded
      appendImport: true,

      // path: anything in these folders is importable
      path: [
          'node_modules/ff/lib/',
          'node_modules/printf/lib'
        ],

      // pathCache: key-value pairs of prefixes that map to folders (eg. prefix
      // 'squill' handles all 'sqill.*' imports)
      pathCache: {
        "squill": 'node_modules/squill/'
      }
    });

    compiler.compile([req.params[0], 'preprocessors.import', 'preprocessors.cls'])
      .on('error', function (err) {
        res.send(err);
      })
      .on('success', function (src) {
        res.header('Content-Type', 'application/javascript')
        res.send(src);
      });
  });
  appRoutes.addToAPI(opts, api);
  return api;
}
function getPath() {
  return path.join.apply(path, [__dirname].concat(Array.prototype.slice.call(arguments)));
}
