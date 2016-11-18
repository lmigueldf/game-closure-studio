import device;
//import ui.resource.loader as loader;

// dependencies
import src.oneflagstudio.commons.utils as utils;
import src.oneflagstudio.commons.CustomStackView as StackView;
//dependency screens
import src.oneflagstudio.screens.UiGameLoader as UiGameLoader;
//dependency screens
import src.oneflagstudio.game.ConfigLoader as Config;
import src.oneflagstudio.commons.UiScreen as Scene;

exports = Class(GC.Application, function() {
    this.initUI = function() {
        var width = device.width;
        var height = device.height;
        utils.scaleRootView(this, width, height);
        //Add a new StackView to the root of the scene graph
        this.rootView = new StackView({
            superview: this,
            x: device.width / 2 - (width / 2),
            y: device.height / 2 - (height / 2),
            width: width,
            height: height,
            clip: true
        });
        this.rootView.push(new UiGameLoader({superview : this}));
    };
    this.launchUI = function() {
        this.startApp();
    };
    this.startApp = function(){
        setTimeout(bind(this, function(){
            //Init config Screens
            Config.load();
            this.rootView.pop(false);
            this.rootView.push(new Scene({
                root: this.rootView
            }), false);
        }), 0);
    };
});
