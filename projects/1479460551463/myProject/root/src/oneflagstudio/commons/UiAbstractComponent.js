import ui.View;
// dependencies
import src.oneflagstudio.commons.OfsSdk as OfsAPI;
import src.oneflagstudio.commons.utils as Utils;
import src.oneflagstudio.game.ConfigLoader as Config;
import src.oneflagstudio.game.Resources as Resources;


exports = Class(ui.View, function(supr) {
    this.API = new OfsAPI();
    this.Utils = Utils;
    this.musicOff = true;
    this.soundOff = true;
    this.build = function(opts){
        this.getResourceImage = function(a, b){
            return Resources.get('all', a, b);
        };
        this.audio = Config.getAudioComponentsConfig(this.CONFIG);
        this.components = Config.getImagesComponentsConfig(this.CONFIG);
        var counter = 0; 
        for(var i in this.components){
            if(this.components[i].repeat){
                counter = 0;
                for(var z = 0; z < this.components[i].rows; z++){
                    for(var q = 0; q < this.components[i].columns; q++){
                        this.components[i].x = this.components[i]._x(q);
                        this.components[i].y = this.components[i]._y(z);
                        this.componentViewInstantiate({opts: this.components[i], row: z, column: q});
                        if(this.components[i].onInput != void 0){
                            this.handleBtnInput(this.components[i].view, 
                                                this.components[i].onInput.btn_normal, 
                                                this.components[i].onInput.btn_pressed, 
                                                bind(this, this.components[i].onInput.execute, this.components[i].onInput.params));
                        }
                        counter = counter +1 ;
                        if(counter == this.components[i].limit){
                            break;
                        }
                    }  
                }
            }else{
                this.componentViewInstantiate({opts: this.components[i]});
                if(this.components[i].onInput != void 0){
                    this.handleBtnInput(this.components[i].view, 
                                        this.components[i].onInput.btn_normal, 
                                        this.components[i].onInput.btn_pressed, 
                                        bind(this, this.components[i].onInput.execute, this.components[i].onInput.params));
                }
            }
        }
        
        for(var t in Config.getHandlers(this.CONFIG)){
            this[t] = Config.getHandlers(this.CONFIG)[t];
        }
        if(Config.getConfigAnimations(this.CONFIG)){
            this.configAnimations = Config.getConfigAnimations(this.CONFIG);
        }
        this.setBackButtonHandling();
        
        // sound handling
        this.handleAudioConfiguration();
        
        if(Config.getSetupComponentsIO(this.CONFIG)){
            this.setupComponentsIO = bind(this,Config.getSetupComponentsIO(this.CONFIG));
        }
        this.setupComponentsIO(opts);
    };
    
    this.setupComponentsIO  = function(){};
    
    this.setBackButtonHandling = function(){
        this.API.setActiveBackButtonHandler(bind(this, this.handlingBackButtonPressed));
    };
    this.handleBtnInput     = function(_node, a, b, cb) {
        var time = 0;
        _node.on('InputStart', bind(this, function() {
            time = Date.now();
            if(a != void 0){
                _node.updateOpts({
                    image : this.getResourceImage(b, 0.75).img
                });
            }
        }));
        _node.on('InputOut', bind(this, function() {
            if (!this.blockInput && Date.now() - time < 300) {
                cb();
            }
            if(b != void 0){
                _node.updateOpts({
                    image : this.getResourceImage(a, 0.75).img
                });
            }
            time = 0;
        }));
    };
    this.handlingBackButtonPressed = function(){
        if (this.time == 0) {
            this.time = Date.now();
        } else if ((Date.now() - this.time) < 1000) {
            this.time = 0;
            return false;
        } else {
            this.time = 0;
        }
//        console.info("Back button pressed on", this.CONFIG);
        if(this.backButtonHandler != void 0){
            this.backButtonHandler();
        }
    };
    
    this.startAnimations = function(_toAnimate){
        Utils.activateAnimations();
        for(var view in _toAnimate){
            switch(_toAnimate[view].animation) {
                case 'continuousAnimateShake':
                    Utils.continuousAnimateShake.call(this.getView(_toAnimate[view].path),
                    this.getParams(_toAnimate[view].path).x,
                    _toAnimate[view].factor, 
                    _toAnimate[view].speed);
                    break;
                case 'continuousAnimateScale':
                    Utils.continuousAnimateScale.call(
                            this.getView(_toAnimate[view].path), 
                        _toAnimate[view].n, 
                        _toAnimate[view].factor, 
                        _toAnimate[view].speed);
                    break;
                case 'continuousAnimateRotation':
                    Utils.continuousAnimateRotation.call(
                            this.getView(_toAnimate[view].path) ,
                            _toAnimate[view].n,
                            _toAnimate[view].speed);
                    break;
                case 'continuousAnimateDirectionVertical':
                    Utils.continuousAnimateDirectionVertical.call(
                            this.getView(_toAnimate[view].path) ,
                            _toAnimate[view].y, 
                            _toAnimate[view].factor,
                            _toAnimate[view].speed);
                    break;
                case 'continuousAnimateDirectionHorizontal':
                    Utils.continuousAnimateDirectionVertical.call(
                            this.getView(_toAnimate[view].path) ,
                            _toAnimate[view].x, 
                            _toAnimate[view].factor,
                            _toAnimate[view].speed);
                    break;
                case 'continuousAnimateWidthHeight':
                    Utils.continuousAnimateWidthHeight.call(this.getView(_toAnimate[view].path), 
                        this.getParams(_toAnimate[view].path).x, 
                        this.getParams(_toAnimate[view].path).y, 
                        this.getParams(_toAnimate[view].path).width, 
                        this.getParams(_toAnimate[view].path).height, 
                        _toAnimate[view].factorWidth, 
                        _toAnimate[view].factorHeight, 
                        _toAnimate[view].speed);
                    break;
            }
        }
    };
    this.stopAnimations = function(){
        Utils.deactivateAnimations();
    };
    
    this.componentViewInstantiate = function(__){
        if(__.opts.parent != null && this.components[__.opts.parent].view){
            __.opts.view = Utils.createUiView(this.components[__.opts.parent].view, __.opts);
        }else if(__.parent != undefined){
            __.opts.view = Utils.createUiView(__.parent, __.opts);
        }else{
            if(__.opts.views){
                if(__.opts.views[__.row] == undefined){ __.opts.views[__.row] = {}};
                __.opts.views[__.row][__.column] = Utils.createUiView(this, __.opts);
            }else{
                __.opts.view = Utils.createUiView(this, __.opts);
            }
        }
        this.checkForChildren(__.opts, __.row, __.column);
    };
    this.checkForChildren = function(opts, row, column) {
        if (opts.children != null) {
            for (var t in opts.children) {
                this.componentViewInstantiate({opts : opts.children[t], parent: opts.repeat ? opts.views[row][column] : opts.view });
                if(opts.children[t].onInput != void 0){
                    this.handleBtnInput(opts.children[t].view, 
                                        opts.children[t].onInput.btn_normal, 
                                        opts.children[t].onInput.btn_pressed, 
                                        bind(this, opts.children[t].onInput.execute, opts.children[t].onInput.params));
                }
            }
        }
    };
    this.getView = function(path){
        var data = Utils.getViewFromComponentsList(this.components, path);
        return data !== void 0 ? (data.repeat ? data.views : data.view) : void 0;
    };
    this.getParams = function(path){
        return Utils.getViewFromComponentsList(this.components, path);
    };
    
        /*** Audio Handling **/
    this.handleAudioConfiguration   = function(){
       this.updateAudioConfiguration();
        if(!this.musicOff){
            this.API.Audio.enableMusic();
        }else{
            this.API.Audio.disableMusic();
        }
        if(!this.soundOff){
            this.API.Audio.enableEffects();
        }else{
            this.API.Audio.disableEffects();
        }
        
        this.API.Audio.play(this.audio.background);       
    };
    this.updateAudioConfiguration   = function(){
        var audioStatus = this.API.GameManager.getAudioStatus();
        this.musicOff = !audioStatus.music;
        this.soundOff = !audioStatus.sound;
    };
    
    // Toogle Sound  
    this.handleSoundInput   = function() {   
        if(this.soundOff){
            this.API.Audio.enableEffects();
            this.API.Audio.play(this.audio.effects[0]);
        }else{
            this.API.Audio.disableEffects();
        }
        this.updateAudioConfiguration();
    };
    // Toogle Music 
    this.handleMusicInput   = function() {
        this.API.Audio.play(this.audio.effects[0]);
        if(this.musicOff){
            this.API.Audio.enableMusic();
        }else{
            this.API.Audio.disableMusic();
        }
        this.updateAudioConfiguration();
    };    
});