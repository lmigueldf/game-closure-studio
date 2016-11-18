/***********************
************************
*** Server Bootstrap ***
************************
************************/
// express magic :P
var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var server = require('http').createServer(app);
var favicon = require('static-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
//var upload = multer({dest: path.join(__dirname, 'uploads')});
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'public', 'images'))
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
var upload = multer({ storage: storage })
var device = require('express-device');
var runningPortNumber = process.env.PORT || 80;
// GC Devkit integrator
/***
***  jshint -W020
***/
require = require('jsio');
/* jshint +W020 */
require('./devkit/src/globals');

/**
 * Override APPS load modules
 * @type {exports|module.exports}
 */
var Module = require('./devkit/src/apps/Module');
var Apps = require('./devkit/src/apps/App');
 Apps.prototype._loadModules = function () {
     var _this = this;
     if (!_this._modules) {
         _this._modules = {};
     }

     var _queue = [];

     function addToQueue(parentPath) {
         function scanDir(basePath) {
             try {
                 return fs.readdirSync(basePath)
                     .map(function (item) {
                         return {
                             path: path.join(basePath, item),
                             parent: parentPath
                         };
                     });

             } catch (e) {}
         }

         _queue.push.apply(_queue, scanDir(path.join(parentPath, 'modules')));
         _queue.push.apply(_queue, scanDir(path.join(parentPath, 'node_modules')));
     }

     /**
      * @One_Flag_Studio
      * Change modules loading rules to use devkit base cached core and
      * cloud available modules for devkit.
      *
      *    - addToQueue(_this.paths.root); // replaced
      */
     var addons = require(path.resolve(_this.paths.root, 'manifest.json')).addons;
     var devkitCoreVersion = addons.devkitVersion || 'default';
     addToQueue(path.join(__dirname, 'cache', devkitCoreVersion));
     var toLoadModules  =  addons.plugins;
     for(var index in toLoadModules){
         addToQueue(path.join(__dirname, 'devkit_modules', toLoadModules[index]));
     }

     while (_queue[0]) {
         var item = _queue.shift();
         var modulePath = path.resolve(_this.paths.root, item.path);
         var parentPath = path.resolve(_this.paths.root, item.parent);
         var packageFile = path.join(modulePath, 'package.json');

         if (!fs.existsSync(packageFile)) { continue; }

         var packageContents;
         try {
             packageContents = require(packageFile);
         } catch (e) {
             return logger.warn('Module', item.path, 'failed to load');
         }

         if (!packageContents.devkit) { continue; }

         var existingModule = _this._modules[packageContents.name];
         if (existingModule) {
             if (existingModule.version !== packageContents.version) {
                 throw new Error(
                     packageContents.name +
                     ' included twice with different versions:\n' +
                     existingModule.version + ': ' + existingModule.path + '\n' +
                     packageContents.version + ': ' + modulePath);
             }
         } else {
             var name = path.basename(modulePath);
             var version = null;
             var isDependency = (_this.paths.root === parentPath);
             if (isDependency && _this._dependencies[name]) {
                 version = _this._dependencies[name].version;
             }

             _this._modules[name] = new Module({
                 name: name,
                 path: modulePath,
                 parent: parentPath,
                 isDependency: isDependency,
                 version: version,
                 packageContents: packageContents
             });
         }

         addToQueue(modulePath);
     }
 };

var middleware = require('./src/middleware');
var routes = require('./src/routes');
var sockets = require('./src/sockets');
///*
// * Register socket endpoints
// */
var io = sockets.initSocketIO(server);
//app.configure(function () {
// I need to access everything in '/public' directly
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: 300000
}));
//set the view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
if (process.env.NODE_ENV === 'production') {
    app.enable('view cache');
} else {
    app.disable('view cache');
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    // logs every request
    //app.use(function (req, res, next) {
    //    // output every request in the array
    //    console.log({method: req.method, url: req.url, device: req.device});
    //    // goes onto the next function in line
    //    next();
    //});
}
app.use(cookieParser());
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded());
app.disable('x-powered-by');
app.enable('verbose errors');
app.use(device.capture());
//app.use(middleware.cacheHeader);
// One Flag Studio Web App
// TODO :: validate authentication with middleware
// use validation session cookie
app.get('/', routes.index);

app.post('/api/load', routes.loadSettings);

app.get('/api/projects', routes.projects);
app.post('/api/newProject', upload.single('logo'),  routes.newProject);
app.post('/api/build',  upload.single('__none'), routes.buildProject);
app.get('/api/download', routes.getApk);

app.get('/api/manif', routes.getManifest);

app.post('/api/list', upload.single('__none'),routes.listFiles);
app.post('/api/upload', upload.single('file'),routes.uploadFile);
app.get('/api/file', routes.getFile);
app.post('/api/delete', upload.single('__none'), routes.deleteFile);

app.get('/api/available_modules', routes.getAvailableModules);
app.post('/api/toggle_module', upload.single('__none'), routes.toggleModule);

// OFS Analytics
app.post('/api/event', upload.single('__none'), routes.analytics);
app.post('/api/views', upload.single('__none'), routes.getViews);

// Noide integration
app.get('/editor', routes.editor);
// Landing Page
app.get('/home', routes.landing);
// GC Devkit Integration
var devkit = require('./devkit/src/serve');
devkit.serveWeb({port: 9200, server: server, app: app, sockets: io, singlePort: true});
server.listen(runningPortNumber);
