import device;
import animate;

import ui.View as View;
import ui.ImageView as ImageView;
import ui.resource.Image as Image;
import ui.SpriteView as SpriteView;

exports = Class(View, function(supr) {
    this.init = function(opts) {
        opts = merge(opts, {});
        supr(this, 'init', [opts]);
        this.build(opts);
        
        this.logoView.show();
        this.loadingView.show();
    };
    
    this.build = function(){
        this.backView = new View({
            superview: this,
            width: device.screen.width,
            height: device.screen.height,
            x: 0,
            y: 0,
            backgroundColor: 'black',
            visible : true
        });
        this.logo = new Image({url: "resources/images/intro/logo.png"});
        this.logoView = new ImageView({
            superview: this,
            image: this.logo,
            width: this.logo.getWidth(),
            height: this.logo.getHeight(),
            x: (device.screen.width - this.logo.getWidth() * 0.9) / 2,
            y: (device.screen.height - this.logo.getHeight() * 0.9) / 2,
            scale: 0.9, 
            visible : false
        });
        
        
        this.loading = new Image({url: "resources/images/intro/loader.png"});
        this.loadingView = new ImageView({
            superview: this,
            image: this.loading,
            width: this.loading.getWidth() * 0.64,
            height: this.loading.getHeight() * 0.64,
            x: (device.screen.width - this.loading.getWidth() * 0.64) / 2,
            y: (device.screen.height - this.loading.getHeight() * 0.64) * 0.75,
            anchorX: (this.loading.getWidth() * 0.64) / 2,
            anchorY: (this.loading.getHeight() * 0.64) / 2, 
            visible : false
        });
        continuousAnimateRotation.call(this.loadingView, 3);
    };
});

function continuousAnimateRotation(n) {
    animate(this)
            .now({r: -3.14 * n}, 1200, animate.linear)
            .then(continuousAnimateRotation.bind(this, n + 2));
}

