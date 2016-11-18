import device;
import src.oneflagstudio.commons.utils as Utils;
import src.oneflagstudio.game.Manager as GameManager;
import util.ajax as ajax;

if (CONFIG.modules.plugins.indexOf('sharing') > -1) {
  jsio('import Sharing as Sharing');
}
if (CONFIG.modules.plugins.indexOf('analytics') > -1) {
  jsio('import Analytics as Analytics');
}
if (CONFIG.modules.plugins.indexOf('localnotify') > -1) {
  jsio('import localNotify as localNotify');
}
if (CONFIG.modules.plugins.indexOf('services') > -1) {
  jsio('import services as services');
}
if (CONFIG.modules.plugins.indexOf('adbuddiz') > -1) {
  jsio('import adbuddiz as adbuddiz');
}
if (CONFIG.modules.plugins.indexOf('giftiz') > -1) {
  jsio('import giftiz as giftiz');
}
// Audio
import src.oneflagstudio.game.Resources as Resources;
import AudioManager;

var gameManager = new GameManager();
var audioManager = new AudioManager({
  path: Resources.getAudioPath(),
  files: Resources.getAudioFiles()
});

exports = Class(function(supr) {
  // Custom Game manager
  this.GameManager = gameManager;
  // Common OFS SDK Tools
  this.openURL = function(url) {
    window.open(url);
  };
  this.setActiveBackButtonHandler = function(cb) {
    device.setBackButtonHandler(cb);
  };
  this.OFS = {
    Analytics:{
      send: function(opts){
        opts.adKey = CONFIG.modules.advertKey;
        opts.timestamp= Date.now();
        ajax.post({
          url: CONFIG.modules.localAnalyticsHost + 'event',
          data: opts
        }, function (err, response) {
          if (err) {
            //console.error('{Local Analytics Error ['+ err +']}');
          } else {
            //console.log('{Local Analytics Success ['+ opts.adKey +']}');
          }
        });
      },
      getViewsCounter: function(cb){
        ajax.post({
          url: CONFIG.modules.localAnalyticsHost + 'views',
          data: {adKey: CONFIG.modules.advertKey}
        }, function (err, response) {
          if (err) {
            //console.error('{Local Analytics --\'getViewsCounter\'-- Error ['+ err +']}');
          } else {
            //console.log('{Local Analytics --\'getViewsCounter\'-- Success ['+ CONFIG.modules.advertKey +']}');
            cb(response.counter)
          }
        });
      }
    }
  };
  this.Store = {
    buy: function(opts) {
      var consumable;
      switch (opts.index) {
        case 0:
          consumable = gameManager.getEnergyCatalog()[opts.item];
          if (gameManager.getCrunchies() >= consumable.cost &&
            (gameManager.getCurrentEnergy() + consumable.value <= 9999)) {
            gameManager.consumeCrunchies(consumable.cost);
            gameManager.incrementEnergy(consumable.value);
            opts.then(true);
          } else {
            opts.failed({
              message: "Not enough Crunchies or Energy limit reached!",
              missing: consumable.cost - gameManager.getCrunchies(),
              limitReached: ((gameManager.getCurrentEnergy() + consumable.value > 9999))
            });
          }
          break;
        case 1:
          consumable = gameManager.getTipsCatalog()[opts.item];
          if (gameManager.getCrunchies() >= consumable.cost &&
            (gameManager.getTips() + consumable.value <= 9999)) {
            gameManager.consumeCrunchies(consumable.cost);
            gameManager.incrementTips(consumable.value);
            opts.then(true);
          } else {
            opts.failed({
              message: "Not enough Crunchies or Tips limit reached!",
              missing: consumable.cost - gameManager.getCrunchies(),
              limitReached: ((gameManager.getTips() + consumable.value > 9999))
            });
          }
          break;
        case 2:
          consumable = gameManager.getCrunchiesCatalog()[opts.item];
          if ((gameManager.getCrunchies() + consumable.value <= 9999)) {
            // HANDLING Purchaces here !!!!
            billing.onPurchase = function(item) {
              gameManager.incrementCrunchies(consumable.value);
              opts.then(true);
            }
            billing.onFailure = function(reason, item) {
              if (reason !== "cancel") {
                // Market is unavailable - User should turn off Airplane mode or find reception.
                opts.failed({
                  message: "Market is unavailable - User should turn off Airplane mode or find reception"
                });
              }
              // Else: Item purchase canceled - No need to present a dialog in response.
            }
            if (!billing.isMarketAvailable) {
              opts.failed({
                message: "Market is unavailable - User should turn off Airplane mode or find reception"
              });
            } else {
              billing.purchase(consumable.itemDescription);
            }
          } else {
            opts.failed({
              message: "Limit Crunchies Reached!",
              limitReached: ((gameManager.getCrunchies() + consumable.value > 9999))
            });
          }
          break;
      }
    },
    removeAds: function() {
      gameManager.removeAds();
    },
    restore: function() {
      billing.restore(function(err) {
        if (err) {
          logger.log("Unable to restore purchases:", err);
        } else {
          logger.log("Finished restoring purchases!");
        }
      });
    }
  };
  this.Audio = {
    play: function(name, opts) {
      audioManager.play(name, opts);
    },
    pause: function(name) {
      audioManager.pause(name);
    },
    stop: function() {
      audioManager.stop(name);
    },
    enableMusic: function() {
      //            console.info("Music ON");
      gameManager.setMusic(true);
      audioManager.setMusicMuted(false);
    },
    enableEffects: function() {
      //            console.info("Sound ON");
      gameManager.setSound(true);
      audioManager.setEffectsMuted(false);
    },
    disableMusic: function() {
      //            console.info("Music OFF");
      gameManager.setMusic(false);
      audioManager.setMusicMuted(true);
    },
    disableEffects: function() {
      //            console.info("Sound OFF");
      gameManager.setSound(false);
      audioManager.setEffectsMuted(true);
    }
  };
  this.Share = function(opts) {
    if (Sharing == void 0) {
      console.warn("{Share} - Plugin is not available with set configuration");
      return;
    }
    if (opts.superview == void 0) {
      console.warn("{Share} - Aborted, you need to provide a superview to share");
      return;
    }
    var opts = {
      title: opts.title || 'Sharing -- OFS Game -- test',
      message: opts.message || 'Dummy message -- missing message ',
      image: Utils.toBase64(opts.superview)
    };
    Sharing.share(opts, function(completed) {
      if (completed) {
        opts.completed && opts.completed();
      } else {
        opts.failed && opts.failed();
      }
    });
  };
  this.Notifications = {
    registerNotificationsListener: function(cb) {
      if (localNotify == void 0) {
        console.warn("{Notifications [registerNotificationsListener]} - Plugin is not available with set configuration");
        return;
      }
      localNotify.onNotify = cb;
    },
    scheduleNotification: function(opts) {
      if (localNotify == void 0) {
        console.warn("{Notifications [scheduleNotification]} - Plugin is not available with set configuration");
        return;
      }
      var delay = {};
      delay.seconds = opts.delay;
      // undefined = no sound, true for default, wav file for custom sound
      var sound = void 0;
      sound = opts.sound || false;
      if (opts.customSound != void 0) {
        sound = opts.customSound;
      }
      // build notification settings
      var settings = {
        name: "ntf8_" + opts.id,
        text: opts.text || "[ ALERT ] Missing Text",
        sound: sound,
        //              // ios only
        //              action: "See Awesome Notification " + id,
        // android only
        title: opts.title || "[ ALERT ] Missing Title",
        vibrate: true,

        delay: delay,
        // can also use date instead of delay object

        userDefined: {
          customData: true
        }
      };
      if (opts.icon != void 0) {
        settings.icon = opts.icon;
      }
      // send a notification
      localNotify.add(settings);
    },
    clearNotifications: function() {
      if (localNotify == void 0) {
        console.warn("{Notifications [clearNotifications]} - Plugin is not available with set configuration");
        return;
      }
      localNotify.clear();
    }
  };
  /**
   * Google Play Services and Admob
   */
  this.Google = {
    Analytics: {
      track: function(name, opts) {
        Analytics.track(name, opts);
      }
    },
    Play: {
      login: function(cb) {
        if (services == void 0) {
          console.warn("{Google Services [Play.onLogin]} - Plugin is not available with set configuration");
          return;
        }
        services.google_play.login(cb);
      },
      onLoginFailed: function(cb) {
        if (services == void 0) {
          console.warn("{Google Services [Play.onLoginFailed]} - Plugin is not available with set configuration");
          return;
        }
        services.google_play.onLoginFailed(cb);
      },
      showAchievements: function() {
        if (services == void 0) {
          console.warn("{Google Services [Play.showAchievements]} - Plugin is not available with set configuration");
          return;
        }
        services.google_play.showAchievements();
      },
      showLeaderboards: function() {
        if (services == void 0) {
          console.warn("{Google Services [Play.showLeaderboards]} - Plugin is not available with set configuration");
          return;
        }
        services.google_play.showLeaderBoard();
      },
      rateApplication: function() {
        if (services == void 0) {
          console.warn("{Google Services [Play.rateApplication]} - Plugin is not available with set configuration");
          return;
        }
        services.google_play.rateApplication();
      },
      sendAchievement: function(key, value) {
        if (services == void 0) {
          console.warn("{Google Services [Play.sendAchievement]} - Plugin is not available with set configuration");
          return;
        }
        services.google_play.sendAchievement(key, value);
      },
      sendScore: function(key, value) {
        if (services == void 0) {
          console.warn("{Google Services [Play.sendScore]} - Plugin is not available with set configuration");
          return;
        }
        services.google_play.sendScore(key, value);
      },
      LOCKED: false,
      EVENTS: {
        ON_SAVE_IN_PROGRESS: 'onSaveInProgress',
        ON_GAME_SAVED: 'onGameSaved',
        ON_LOAD_PROGRESS: 'onLoadProgress',
        ON_GAME_LOADED: 'onGameLoaded',
      },
      registerEventHandler: function(event, cb) {
        if (this.EVENTS[event]) {
          console.error("{GooglePlay} Cannot register EVENT for service. (Reason: NOT AVAILABLE)");
          return;
        }
        if (services == void 0) {
          console.warn("{Google Services [registerEventHandler]} - Plugin is not available with set configuration");
          return;
        }
        services.google_play.on(event, cb);
      },
      showSavedGamesUI: function(snapshotName, description, dataTosave) {
        if (services == void 0) {
          console.warn("{Google Services [showSavedGamesUI]} - Plugin is not available with set configuration");
          return;
        }
        if (this.LOCKED) {
          console.error("{GooglePlay :: showSavedGamesUI} Cannot process operation. LOCKED");
          return;
        }
        this.LOCKED = true;
        services.google_play.showSavedGamesUI(snapshotName, description, JSON.stringify(dataTosave));
      },
      saveGame: function(snapshotName, dataTosave, newFile) {
        if (services == void 0) {
          console.warn("{Google Services [saveGame]} - Plugin is not available with set configuration");
          return;
        }
        if (this.LOCKED) {
          console.error("{GooglePlay :: saveGame} Cannot process operation. LOCKED");
          return;
        }
        this.LOCKED = true;
        services.google_play.saveGame(snapshotName, JSON.stringify(dataTosave), newFile);
      },
      loadSavedGame: function(snapshotName) {
        if (services == void 0) {
          console.warn("{Google Services [loadSavedGame]} - Plugin is not available with set configuration");
          return;
        }
        if (this.LOCKED) {
          console.error("{GooglePlay :: loadSavedGame} Cannot process operation. LOCKED");
          return;
        }
        this.LOCKED = true;
        services.google_play.loadSavedGame(snapshotName);
      },
      unlock: function() {
        this.LOCKED = false;
      },
      speak: function(text) {
        services.google_play.speakOut(text);
      },
      speachToText: function() {
        services.google_play.speachToText();
      },

      checkMatches: function() {
        services.google_play.checkGames();
      },
      startNewMatch: function(min, max) {
        services.google_play.startNewMatch(min, max);
      },
      initGame: function(data) {
        services.google_play.startMatchData(data);
      },
      doTurn: function(data) {
        services.google_play.doTurn(data);
      },
      endMatch: function(data) {
        services.google_play.endMatch();
      }
    },
    AdMob: {
      showInterstitial: function() {
        if (services == void 0) {
          console.warn("{Google Services [AdMob.showInterstitial]} - Plugin is not available with set configuration");
          return;
        }
        services.admob.displayInterstitial();
      },
      loadInterstitial: function() {
        if (services == void 0) {
          console.warn("{Google Services [AdMob.loadInterstitial]} - Plugin is not available with set configuration");
          return;
        }
        services.admob.loadInterstitial();
      }
    }
  };
  /**
   * Partner Services
   */
  this.PurpleBrain = {
    Adbuddiz: {
      EVENTS: {
        CACHE_AD: "CacheAd",
        SHOW_AD: "ShowAd",
        FAIL_TO_SHOW_AD: "FailToShowAd",
        CLICK: "Click",
        HIDE_AD: "HideAd"
      },
      showInterstitial: function() {
        if (adbuddiz == void 0) {
          console.warn("{PurpleBrain [Adbuddiz.showInterstitial]} - Plugin is not available with set configuration");
          return;
        }
        adbuddiz.showInterstitial();
      },
      registerEventHandler: function(event, cb) {
        if (adbuddiz == void 0) {
          console.warn("{PurpleBrain [Adbuddiz.registerEventHandler]} - Plugin is not available with set configuration");
          return;
        }
        if (services == void 0) {
          console.warn("{Google Services [AdMob.showInterstitial]} - Plugin is not available with set configuration");
          return;
        }
        if (this.EVENTS[event]) {
          console.error("{Adbuddiz} Cannot register EVENT for service. (Reason: NOT AVAILABLE)");
          return;
        }
        adbuddiz.on(event, cb);
      }
    },
    Giftiz: {
      EVENTS: {
        BUTTON_INVISIBLE: "ButtonInvisible",
        BUTTON_NAKED: "ButtonNaked",
        BUTTON_BADGE: "ButtonBadge",
        BUTTON_WARNING: "ButtonWarning"
      },
      click: function() {
        if (giftiz == void 0) {
          console.warn("{PurpleBrain [Giftiz.click]} - Plugin is not available with set configuration");
          return;
        }
        giftiz.clickedGiftizButton();
      },
      missionComplete: function() {
        if (giftiz == void 0) {
          console.warn("{PurpleBrain [Giftiz.missionComplete]} - Plugin is not available with set configuration");
          return;
        }
        giftiz.missionComplete();
      },
      registerEventHandler: function(event, cb) {
        if (giftiz == void 0) {
          console.warn("{PurpleBrain [Giftiz.registerEventHandler]} - Plugin is not available with set configuration");
          return;
        }
        if (this.EVENTS[event]) {
          console.error("{Giftiz} Cannot register EVENT for service. (Reason: NOT AVAILABLE)");
          return;
        }
        giftiz.on(event, cb);
      }
    }
  };
});