import device;
import src.oneflagstudio.game.Resources as Resources;
// Navigation
import src.oneflagstudio.commons.UiScreen as Scene;

var smallScreenRatio = (((device.screen.height / device.screen.width) * 100) < 155);
exports = {
    audio: {},
    viewNodes: {
        "background": {
            width: device.screen.width,
            height: device.screen.height,
            image: Resources.get('background'),
            opacity: 1
        }
    },
    configAnimations: {},
    setupComponentsIO: function() {},
    handlers: {}
};
