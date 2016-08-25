var chokidar = require('chokidar');
var p = require('path');
var FileSystemObject = require('../../shared/file-system-object');
var watchers = {};
var ignoredFolders = [
    'build', 'modules','.git', 'keystores', 'resources'
];
module.exports = {
    init: function (pid) {
        if(watchers[pid]){
            console.info('Watcher already exists');
            return watchers[pid];
        }
        var basePath = '../../projects/'+ pid +'/';
        watchers[pid] = chokidar.watch(p.join(__dirname, basePath), {
            ignored: function (path, stat) {
                // This function gets called twice per path.
                // Once with a single argument (the path),
                // second time with two arguments (the path and the fs.Stats object of that path).
                var ignore = false;
                for(var i in ignoredFolders){
                    var toBeIgnoredPath = p.join(__dirname, basePath + ignoredFolders[i]);
                    ignore = (path == toBeIgnoredPath);
                    if(ignore){
                        break;
                    }
                }
                return ignore;
            },
            ignoreInitial: true
        });
        return watchers[pid];
    },
    close: function(pid){
        watchers[pid].close();
    },
    watched(pid) {
        var items = {};
        var watched = watchers[pid].watched;
        for (var dirpath in watched) {
            // add directory
            items[dirpath] = new FileSystemObject(dirpath, true);
            for (var i = 0; i < watched[dirpath].length; i++) {
                var name = watched[dirpath][i];
                var path = p.join(dirpath, name);
                if (!watched[path]) {
                    // add file
                    items[path] = new FileSystemObject(path, false);
                }
            }
        }
        return items;
    }
};
