import device;
import animate;
import ui.TextView
import ui.View;
import ui.ImageView;

/**
 * Returns a random float between `low` and `high`, high exclusive, or
 * between 0 and `low` if no `high` was passed.
 * @method randFloat
 * @return {float}
 */
exports.randFloat = function (low, high) {
	if (high == null) {
		high = low;
		low = 0;
	}
	return low + ((high - low) * Math.random());
}

/**
 * Returns a random int between `low` and `high`, high exclusive, or
 * between 0 and `low` if no `high` was passed.
 * @method randInt
 * @return {int}
 */
exports.randInt = function (low, high) {
	return exports.randFloat(low, high) | 0;
}

/**
 * Given an array, returns a random element from the array.
 * @method choice
 * @param {Array} arr
 * @returns random element
 */
exports.choice = function (arr) {
	return arr[arr.length * Math.random() | 0];
}

/**
 * Scales the root view of the DevKit application so that it has a
 * size of W x H but always fits within the main window, letterboxing
 * the view if necessary. A typical size is 1024x576, for fitting in
 * most phones reasonably well. You should call this function before
 * adding any other views to the app.
 * @method scaleRootView
 * @param {GC.Application} app
 * @param W desired main view width
 * @param H desired main view height
 */
exports.scaleRootView = function (app, W, H) {
	var view = app.view;
	var scale = Math.min(view.style.width / W, view.style.height / H);	
	app.view = new ui.View({
		superview: view,
		scale: scale,
		width: W, 
		height: H, 
		x: (device.screen.width - W * scale) / 2,
		y: (device.screen.height - H * scale) / 2,
		clip: true,
	});		
}

/**
 * Creates a global  Ui view (Image || Text || View) with scale factor
 */
exports.createUiView = function(parent, opts){
        var view;
        if(opts.image != null) {
            view =  new ui.ImageView({
                superview: parent,
                image:  opts.image.img,
                width:  opts.width  || opts.image.width,
                height: opts.height || opts.image.height,
                x: (opts.x || 0),
                y: (opts.y || 0),
                opacity : opts.opacity || 1,
                canHandleEvents : false 
            });
        }else if(opts.text != null){
            view = new ui.TextView({
                superview: parent,
                text: opts.text,
                color: opts.color || 'black',
                x: opts.x || 0,
                y: opts.y || 0,
                width:  opts.width,
                height: opts.height,
                canHandleEvents : false ,
                strokeWidth : opts.strokeWidth  || 0,
                strokeColor  : opts.strokeColor   || void 0,
                shadowWidth   : opts.shadowWidth   || 0,
                shadowColor   : opts.shadowColor    || void 0,
                fontWeight : opts.fontWeight || 'normal',
                shadowColor: opts.shadowColor || 'black',
                wrap : opts.wrap  || false,
                opacity : opts.opacity || 1
            });
            
            if(opts.horizontalAlign != null){
                view.updateOpts({
                    horizontalAlign : opts.horizontalAlign
                });
            }
            
            if(opts.size != null){
                view.updateOpts({
                    size : opts.size
                });
            }
        }else{
            view =  new ui.View({
                superview: parent,
                width:  opts.width,
                height: opts.height,
                x: opts.x || 0,
                y: opts.y || 0,
                opacity : opts.opacity || 1,
                canHandleEvents : false
            });
        }
        if(opts.backgroundColor != null){
            view.updateOpts({
                backgroundColor : opts.backgroundColor
            });
        }
        if(opts.centerAnchor == true){
            view.updateOpts({
                anchorX :  opts.image != null ? opts.width  != null ?((opts.width)  /2):((opts.image.width) /2) : (opts.width)  /2,
                anchorY :  opts.image != null ? opts.height != null ?((opts.height) /2):((opts.image.height)/2) : (opts.height) /2
            });
        }
        if(opts.r != null){
            view.updateOpts({
                r : opts.r
            });
        }
        if(opts.visible != null){
            view.updateOpts({
                visible : opts.visible
            });
        }
        if(opts.scale != null){
            view.updateOpts({
                scale : opts.scale
            });
        }
        if(opts.canHandleEvents != null){
            view.updateOpts({
                canHandleEvents : opts.canHandleEvents
            });
        }
        if(opts.blockEvents != null){
            view.updateOpts({
                blockEvents : opts.blockEvents
            });
        }
        if(opts.clip != null){
            view.updateOpts({
                clip : opts.blockEvents
            });
        }
        if(opts.centerX != void 0 && opts.centerX){
            view.updateOpts({
                x : (device.screen.width - view.style.width)/2 
            });
            opts.x = (device.screen.width - view.style.width)/2 ;
        }
        if(opts.centerY != void 0 && opts.centerY){
            view.updateOpts({
                y : (device.screen.height -  view.style.height)/2 
            });
            opts.y = (device.screen.height -  view.style.height)/2 ;
        }
        opts.width  = view.style.width;
        opts.height = view.style.height;
        return view;
};

exports.getViewFromComponentsList = function(list , path){
        var temp = null;
        if(path.length > 1){
            for(var i = 0; i < path.length; i++){
                if(i === 0){
                    temp = list[path[i]];
                }else{
                    temp = temp.children[path[i]];
                }
            }
        }else if(path.length){
            temp = list[path[0]];
        }else{
            return null;
        }
        return temp;
};

var Canvas = device.get('Canvas');
var IS_NATIVE = !device.isSimulator && !device.isMobileBrowser;
// this MUST be used within a VIEW or IMAGEVIEW SCOPE and MUST be BIND to the SCOPE
// p.ex. var url = bind([VIEW SCOPE], toBase64());
exports.toBase64 = function(superview){
    var canvas = new Canvas({
          width : device.width,
          height: device.height
        });
        
        // Save position of animated view and restore after render.
        var as = superview.style;
        var x = as.x;
        var y = as.y;
        as.x = 0;
        as.y = 0;

        superview.__view.wrapRender(canvas.getContext('2D'), {});

        as.x = x;
        as.y = y;

        var url = canvas.toDataURL('image/png');
        if (IS_NATIVE) {
          return 'data:image/png;base64,' + url;
        }

        return url;
};

// animations helpers
var loop = false;
exports.isActive = function(){
    return loop;
};
exports.activateAnimations = function(){
    loop = true;
};
exports.deactivateAnimations = function(){
    loop = false;
};
exports.continuousAnimateRotation = function continuousAnimateRotation(n, speed) {
    if(!loop){
        return;
    }
    animate(this).clear()
            .now({r: -3.14 * n}, (speed || 10000), animate.linear)
            .then(continuousAnimateRotation.bind(this, n + 1, speed));
};
exports.continuousAnimateScale = function continuousAnimateScale(n, factor, speed) {
    if(!loop){
        return;
    }
    animate(this).clear()
            .now ({scale: n * (factor || 0.9)}, (speed || 800), animate.easeIn)
            .then({scale: n}, (speed || 800), animate.easeOut)
            .then(continuousAnimateScale.bind(this, n, factor, speed));
};
exports.continuousAnimateShake = function continuousAnimateShake(x, factor, speed){ 
    if(!loop){
        return;
    }
    animate(this).clear()
            .now ({x: x - (factor * 20)}, (speed || 800), animate.easeOut)
            .then({x: x + (factor * 20)}, (speed || 800), animate.easeIn)
            .then({x: x}, (speed || 800), animate.easeOut)
            .then(continuousAnimateShake.bind(this, x, factor, speed));
};
exports.continuousAnimateWidthHeight = function continuousAnimateWidthHeight(x, y, width, height, factorWidth, factorHeight, speed) {
    if(!loop){
        return;
    }
    animate(this).clear()
            .now ({
                x: x -(((width  * factorWidth)- width)/2),
                y: y -(((height  * factorHeight)- height)/2),
                width  : width  * factorWidth,
                height : height * factorHeight
            }, (speed || 800), animate.easeIn)
            .then({
                x: x,
                y: y,
                width  : width,
                height : height
            }, (speed || 800), animate.easeOut)
            .then(continuousAnimateWidthHeight.bind(this, x, y, width, height, factorWidth, factorHeight, speed));
};
exports.continuousAnimateDirectionVertical = 
        function continuousAnimateDirectionVertical(y, factor, speed) {
    if(!loop){
        return;
    }
    animate(this).clear()
            .now ({
                y: factor * y,
            }, (speed || 800), animate.easeIn)
            .then({
                y: y,
            }, (speed || 800), animate.easeOut)
            .then(continuousAnimateDirectionVertical.bind(this, y, factor, speed));
};
exports.continuousAnimateDirectionHorizontal = 
        function continuousAnimateDirectionVertical(x, factor, speed) {
    if(!loop){
        return;
    }
    animate(this).clear()
            .now ({
                x: factor * x,
            }, (speed || 800), animate.easeIn)
            .then({
                x: x,
            }, (speed || 800), animate.easeOut)
            .then(continuousAnimateDirectionVertical.bind(this, x, factor, speed));
};