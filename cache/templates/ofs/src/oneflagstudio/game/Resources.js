"use strict";
import device;
import ui.resource.Image as Image;
var resources = {};

// AUDIO
resources.audioPath = 'resources/sounds';
resources.audioFiles = {};

// IMAGES
// resources for titlescreen
resources = {
    "background" : new Image({url: "resources/images/background.png"})
};


// public available functions
exports.get = function (button, scaleFactor) {
        if(resources[button] == void 0){
            console.warn(screen,button);
        }
        var scale = Math.min(device.screen.width / resources[button].getWidth(),
                                device.screen.height / resources[button].getHeight()) * (scaleFactor || 1);
	return {
            scale : scale,
            img : resources[button],
            width  : resources[button].getWidth()  * scale,
            height : resources[button].getHeight() * scale
        };
};
exports.getResource = exports.get;
exports.getAudioPath  = function(){ return resources.audioPath;};
exports.getAudioFiles = function(){ return resources.audioFiles;};
