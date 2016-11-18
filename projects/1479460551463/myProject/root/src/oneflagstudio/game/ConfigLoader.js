import src.oneflagstudio.game.config.Titlescreen as Titlescreen;
var screens = {};
exports.load = function() {
    // config for -----------------  TITLESCREEN  ----------------------------------
    screens['titlescreen'] = Titlescreen;
};
// public available functions  -------------------------------------------------
exports.getImagesComponentsConfig = function(screen) {
    return screens[screen].viewNodes;
};
exports.getAudioComponentsConfig = function(screen) {
    return screens[screen].audio;
};
exports.getHandlers = function(screen) {
    return screens[screen].handlers;
};
exports.getConfigAnimations = function(screen) {
    return screens[screen].configAnimations;
};
exports.getSetupComponentsIO = function(screen) {
    return screens[screen].setupComponentsIO;
};
