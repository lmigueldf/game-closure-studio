var sockets = require('../sockets');
var path = require('path');
var fs = require('fs');
var apps = require('../../devkit/src/apps');
var build = require('../../devkit/src/build');
var commands = require('../../devkit/src/commands/index');
/**
 * GET home page.
 */
var builds = {};
exports.index = function (req, res) {
    res.render('index', {});
};
exports.landing = function (req, res) {
    res.render('home', {});
};
exports.projects = function (req, res) {
    var availableProjects = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'projects', 'projects.json'), 'utf8')).availableProjects || [];
    res.json({projects: availableProjects});
};
exports.loadSettings = function (req, res) {
    res.json({
        token: '5afe-11e5-885d-feff819cdc9f-7f8af060',
        projectsPath: path.join(__dirname, '..', '..', 'projects') + '/',
        device: '#device={\"type\":\"iphone6\"}'
    });
};
exports.newProject = function (req, res) {
    var projectUUID = Date.now() + '';
    var appPath = path.join(__dirname, '..', '..', 'projects', projectUUID);
    if (!fs.existsSync(appPath)) {
        fs.mkdirSync(appPath);
        fs.mkdirSync(path.join(__dirname, '..', '..', 'projects', projectUUID, 'myProject'));
    } else {
        projectUUID = Date.now() + '';
        fs.mkdirSync(path.join(__dirname, '..', '..', 'projects', projectUUID));
        fs.mkdirSync(path.join(__dirname, '..', '..', 'projects', projectUUID, 'myProject'));
    }
    var projectPath = path.join(__dirname, '..', '..', 'projects', projectUUID, 'myProject', 'root');
    var data = JSON.parse(req.body.formData);
    var fileIcon = req.file != void 0 ?
    '/images/' + req.file.originalname : '/images/logo.png';
    var projectsPath = path.join(__dirname, '..', '..', 'projects', 'projects.json');
    var availableProjects = JSON.parse(fs.readFileSync(projectsPath, 'utf8')).availableProjects || [];
    return Promise.bind(this).then(function () {
            // create the app
            return apps.create(projectPath, {
                type: 'local',
                path : path.join(__dirname, '../../cache/templates/ofs')
            });
        })
        .then(function (app) {
            availableProjects.push({
                id: projectUUID,
                title: data.title || 'Project_' + projectUUID,
                type: data.type || 'N/A',
                icon: fileIcon,
                description: data.description || 'N/A'
            });
            fs.writeFileSync(projectsPath, JSON.stringify({availableProjects: availableProjects}));
            var filePath = path.join(__dirname, '..', '..', 'projects', projectUUID, 'myProject', 'root', 'manifest.json');
            var projectManifest = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            var defaultManifest = {
                "addons": {
                    "plugins": [],
                    "piggyBank": {
                        "prefix": "__KGGNC21478545PPIRh65tgf",
                        "storageKey": "6313143545412"
                    }
                },
                "android": {
                    "icons": {
                        "36": "resources/icons/android36.png",
                        "48": "resources/icons/android48.png",
                        "72": "resources/icons/android72.png",
                        "96": "resources/icons/android96.png",
                        "144": "resources/icons/ios144.png"
                    },
                    "googleTrackingID": "SET_THIS",
                    "GooglePlayID": "SET_THIS",
                    "useAdmob": true,
                    "admobType": "Interstitial",
                    "admobUnitID": "SET_THIS",
                    "useGooglePlay": "true",
                    "useGoogleSave": "true",
                    "versionCode": 1
                },
                "appID": projectManifest.appID,
                "dependencies": {},
                "gameHash": "DAsdw3edawd34dasdasd-" + projectManifest.appID,
                "icons": "resources/icons/icon512.png",
                "installShortcut": true,
                "resources": {},
                "sdkVersion": "release-0.1.2",
                "shortName": "myGame",
                "splash": {
                    "autoHide": true,
                    "universal": "resources/splash/portrait2048.png"
                },
                "studio": {
                    "domain": "oneflag.com",
                    "name": "One Flag Studio",
                    "stagingDomain": "com.oneflag.myGame"
                },
                "supportedOrientations": [
                    "portrait"
                ],
                "targets": {},
                "title": data.title || 'myGame'
            };
            fs.writeFileSync(filePath, JSON.stringify(defaultManifest));
            return new Promise(function (resolve) {
                res.json({app: req.body});
            });
        }).catch(function (err) {
            res.json({err: err});
        });
};
exports.buildProject = function (_req, _res, next) {
    var request = JSON.parse(_req.body.formData);
    var pid = request.id;
    var targetIndex = request.target || 0;
    var debug = request.debug || false;
    var clean = request.clean;
    var compress = request.compress;
    var appPath = path.join(__dirname, '..', '..', 'projects', pid, 'myProject', 'root');

    var targets = ['native-android', 'browser-desktop'];
    var opts = ['clean', 'compress', 'baseURL'];
    build.build(appPath, {target: targets[targetIndex], debug: debug}, function (err, res) {
        if (err != void 0) {
            _res.json({
                err: err
            });
        } else {
            var filename = res.config.packageName.split('.').reverse()[0] + ( targetIndex == 0 ? '.apk' : '');
            builds[pid] = {
                path: path.join(res.config.outputPath, filename),
                filename: filename
            };
            _res.json({
                err: err, res: {
                    pid: pid
                }
            });
        }
    });
};
var mime = require('mime');
exports.getApk = function (req, res) {
    var pid = req.query.pid;
    var file = builds[pid].path;
    var mimetype = mime.lookup(builds[pid].path);
    res.setHeader('Content-disposition', 'attachment; filename=' + builds[pid].filename);
    res.setHeader('Content-type', mimetype);
    var filestream = fs.createReadStream(file);
    filestream.pipe(res);
}
exports.removeProject = function (req, res) {
    res.json({err: 'TODO :: remove project'});
};
exports.editor = function (req, res) {
    sockets.startFileSystemWatcher(req.query.id);
    res.render('editor', {});
};
exports.listFiles = function (req, res, next) {
    var request = JSON.parse(req.body.formData);
    var pid = request.pid;
    var type = request.folder;
    var appPath = path.join(__dirname, '..', '..', 'projects', pid, 'myProject', 'root', 'resources', type);
    var fileList = fs.readdirSync(appPath);
    res.json({
        files: fileList.filter(function (file) {
            return file.endsWith('.png') || file.endsWith('.mp3');
        })
    });
};
exports.getManifest = function (req, res) {
    var pid = req.query.pid;
    var filename = 'manifest.json';
    var filePath = path.join(__dirname, '..', '..', 'projects', pid, 'myProject', 'root', filename);
    var projectManifest = JSON.parse(fs.readFileSync(filePath, 'utf8'));//require(filePath);
    res.json(projectManifest);
};
exports.getFile = function (req, res) {
    var pid = req.query.pid;
    var filename = req.query.file + (req.query.type != void 0 ? req.query.type : '');
    var filetype = req.query.filetype || 'images';
    var filePath = path.join(__dirname, '..', '..', 'projects', pid, 'myProject', 'root', 'resources', filetype, filename);
    var mimetype = mime.lookup(filePath);
    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.setHeader('Content-type', mimetype);
    var filestream = fs.createReadStream(filePath);
    filestream.pipe(res);
}
exports.uploadFile = function (req, res) {
    var request = JSON.parse(req.body.formData);
    var pid = request.id;
    var type = req.file.originalname.endsWith('.mp3') ? 'sounds' :
        request.type != void 0 && request.type == 'icon' ? 'icons' : 'images';
    var filename = req.file.originalname;
    // move file to project folder
    var oldPath = path.join(__dirname, '..', '..', 'public', 'images', filename);
    var newFilename = request.type != void 0 && request.type == 'icon' ? request.filename : filename;
    var newPath = path.join(__dirname, '..', '..', 'projects', pid, 'myProject', 'root', 'resources', type, newFilename);
    fs.renameSync(oldPath, newPath);
    res.json({body: 'done'});
};
exports.deleteFile = function (req, res) {
    var request = JSON.parse(req.body.formData);
    var pid = request.id;
    var type = request.filename.endsWith('.mp3') ? 'sounds' : 'images';
    var filename = request.filename;
    var filePath = path.join(__dirname, '..', '..', 'projects', pid, 'myProject', 'root', 'resources', type, filename);
    fs.unlink(filePath, (err) => {
        if (err) throw err;
        res.json({body: 'done'});
    });
};
function parseAvailableModules(pid) {
    var projectManifest = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'projects', pid, 'myProject', 'root', 'manifest.json'), 'utf8')).addons.plugins || [];
    var availableModules = require(path.join(__dirname, '..', '..', 'devkit_modules', 'modules.json')).modules || [];
    var parsedModules = [];
    for (var index in availableModules) {
        var _module = {};
        if (projectManifest && projectManifest.indexOf(availableModules[index].name) > -1) {
            _module.state = true;
        } else {
            _module.state = false;
        }
        _module.id = availableModules[index].id;
        _module.name = availableModules[index].name;
        _module.title = availableModules[index].title || 'NO TITLE ADDED';
        _module.description = availableModules[index].description || 'No description provided';
        _module.icon = availableModules[index].icon || 'gamepad';
        parsedModules.push(_module);
    }
    return parsedModules;
}
exports.getAvailableModules = function (req, res) {
    res.json(parseAvailableModules(req.query.pid));
};
exports.toggleModule = function (req, res) {
    var data = JSON.parse(req.body.formData);
    var pid = data.pid;
    var mid = data.mid;
    var modules = require(path.join(__dirname, '..', '..', 'devkit_modules', 'modules.json')).modules;
    var mName;
    for (var i in modules) {
        if (modules[i].id == mid) {
            mName = modules[i].name;
            break;
        }
    }
    if (!mName) {
        res.json({err: 'Module not found {MODULE_ID: ' + mid + '}'});
    } else {
        var filePath = path.join(__dirname, '..', '..', 'projects', pid, 'myProject', 'root', 'manifest.json');
        var projectManifest = require(filePath);
        var projectModules = projectManifest.addons.plugins != void 0 ? projectManifest.addons.plugins : projectManifest.addons.plugins = [] & projectManifest.addons.plugins || [];
        var err;
        if (projectModules.indexOf(mName) < 0) {
            projectModules.push(mName);
        } else {
            projectModules.splice(projectModules.indexOf(mName), 1);
        }
        fs.writeFileSync(filePath, JSON.stringify(projectManifest));
    }
    res.json(parseAvailableModules(pid));
};

exports.analytics = function(req, res){
    var data = req.body;
    res.json({ 200 : 'OK'});
};
exports.getViews = function(req, res){
    var data = req.body;
    res.json({ counter : 1000});
};
