import src.oneflagstudio.game.config.Default as ____;
// LocalStorage
import src.oneflagstudio.commons.LocalStorage as LocalStorage;

exports = Class(function(supr) {
    this.init = function(){
        LocalStorage.setPrefix(CONFIG.modules.piggyBank.prefix);
        this.loadGameState();
    };

    this.saveCurrentGameState = function(){
        LocalStorage.set(CONFIG.modules.piggyBank.storageKey, ____ );
    };
    this.loadGameState = function(){
        ____ = LocalStorage.get(CONFIG.modules.piggyBank.storageKey) || ____;
    };

    this.isFirstAccess = function(){
        if(____.firstAccess){
            ____.firstAccess = false;
            this.saveCurrentGameState();
            return true;
        }else{
            return false;
        }
    };

    this.getCurrentStage = function(){
        return ____.currentStage;
    };
    this.getLevel = function(_){
        return ____.levels[_];
    };
    this.getLevelBestTime = function(_){
        return ____.levels[_].time;
    };
    this.getLevelCost = function(_){
        return ____.levels[_].cost;
    };
    this.getLevelStars = function(_){
        return ____.levels[_].stars;
    };
    this.updateLevelStats = function(_, opts){
        ____.levels[_-1].stars    = opts.stars;
        if(____.levels[_-1].time === 0 ||
            ____.levels[_-1].time > opts.elapsedTime){
            ____.levels[_-1].time     = opts.elapsedTime;
        }
        ____.levels[_].locked   = false;
        this.saveCurrentGameState();
    };

    this.isEnergyFull = function(){
        return (____.energy.current >= ____.energy.max);
    };
    this.getEnergy = function(){
        return ____.energy;
    };
    this.getCurrentEnergy = function(){
        return ____.energy.current;
    };
    this.getMaxEnergy = function(){
        return ____.energy.max;
    };

    this.incrementEnergy = function(value){
        ____.energy.current += value;
        this.saveCurrentGameState();
    };
    this.consumeEnergy = function(_){
        ____.energy.current -=  ____.levels[_].cost;
        this.saveCurrentGameState();
        this.setTimerNextFull();
    };

    this.getTips = function(){
        return ____.tips;
    };
    this.consumeTips = function(){
        ____.tips -= 1;
        this.saveCurrentGameState();
    };
    this.incrementTips = function(value){
        ____.tips += value;
        this.saveCurrentGameState();
    };

    this.getCrunchies = function(_){
        return ____.crunchies;
    };
    this.consumeCrunchies = function(_){
        ____.crunchies -= _;
        this.saveCurrentGameState();
    };
    this.incrementCrunchies = function(value){
        ____.crunchies += value;
        this.saveCurrentGameState();
    };

    this.restartTimerState = function(){
        if(this.isEnergyFull()){
            ____.counter.full = -1;
            ____.counter.next = -1;
        }else if(Date.now() > ____.counter.full){
            ____.energy.current =  ____.energy.max;
            ____.counter.full = -1;
            ____.counter.next = -1;
        }else{
            if(____.counter.full == undefined ||
                ____.counter.full < Date.now()){
                console.error("This cannot happen!!!");
                ____.counter.full = Date.now() + (____.energy.max - ____.energy.current)* ____.counter.nextTimer;
            }
            var t = (____.counter.full - Date.now())  / ____.counter.nextTimer;
            var e = (____.counter.full - Date.now())  % ____.counter.nextTimer;
            ____.energy.current = ____.energy.max -  Math.floor(t) - 2;
            ____.counter.next   = Date.now() + Math.floor(e);
        }
        this.saveCurrentGameState();
    };
    this.setTimerNextFull = function(){
        var missing = ____.energy.max -  ____.energy.current;
        ____.counter.full = Date.now() + (____.counter.nextTimer * missing);
        this.saveCurrentGameState();
    };
    this.setTimerNext = function(){
        ____.counter.next = Date.now() + ____.counter.nextTimer ;
        this.saveCurrentGameState();
    };
    this.getRemainingTime = function(){
        return ____.counter.next - Date.now();
    };

    // Catalogs
    this.getEnergyCatalog       = function(){
        return ____.catalog.energy;
    };
    this.getTipsCatalog         = function(){
        return ____.catalog.tips;
    };
    this.getCrunchiesCatalog    = function(){
        return ____.catalog.crunchies;
    };

    // Remove Ads
    this.removeAds = function(){
        ____.showAds = false;
        this.saveCurrentGameState();
    };
    this.showAds = function(){
        return ____.showAds;
    };

    this.getAudioStatus = function(){
        return {
            sound : this.getSound(),
            music : this.getMusic()
        };
    };
    this.getSound = function(){
        return ____.sound;
    };
    this.setSound = function(value){
        if(value != this.getSound()){
            ____.sound = value;
            this.saveCurrentGameState();
        }
    };
    this.getMusic = function(){
        return ____.music;
    };
    this.setMusic = function(value){
        if(value != this.getMusic()){
            ____.music = value;
            this.saveCurrentGameState();
        }
    };
});

