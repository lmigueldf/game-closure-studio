// Class inherits from
import src.oneflagstudio.commons.UiAbstractComponent as UiScreen;
import device;
exports = Class(UiScreen, function(supr) {
    this.init = function(opts) {
        this.rootView = opts.root;
        this.CONFIG = opts.screenId  || 'titlescreen';
        this.leave = opts.leave;
        opts = merge(opts, {
                superview: this,
                x: 0,
                y: 0,
                width : device.screen.width,
                height: device.screen.height
            });
        supr(this, 'init', [opts]);
        // public abstract functions
        this.build(opts);
    }; 
});


