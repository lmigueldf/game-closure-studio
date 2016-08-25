var socketio = require('socket.io');
var fileSystemSocket = require('./file-system');
var fileSystemWatcherSocket = require('./file-system-watcher');
var ioHolder = void 0;
module.exports = {
    initSocketIO: function (app) {
        ioHolder = socketio.listen(app);
        fileSystemSocket(ioHolder);
        return ioHolder;
    },
    startFileSystemWatcher: function(pid){
        fileSystemWatcherSocket.start(ioHolder, pid);
    }
};
