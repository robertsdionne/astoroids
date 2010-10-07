// Copyright 2010 Robert Scott Dionne. All Rights Reserved.

/**
 * @fileoverview
 * @author robertsdionne@gmail.com (Robert Scott Dionne)
 */

goog.provide('astoroids.Sound');


astoroids.Sound = function(name) {
  /**
   * @type {string}
   */
  this.name_ = name;

  /**
   * @type {Audio}
   */
  this.audio_;
};


astoroids.Sound.OGG_FORMAT = 'sound/ogg/%s.ogg';


astoroids.Sound.WAV_FORMAT = 'sound/wav/%s.wav';


astoroids.Sound.prototype.load = function() {
  if (!this.audio_) {
    this.audio_ = new Audio();
    if (navigator.userAgent.indexOf('Chrome') > -1) {
      this.audio_.src = astoroids.Sound.OGG_FORMAT.replace('%s', this.name_);
    } else {
      this.audio_.src = astoroids.Sound.WAV_FORMAT.replace('%s', this.name_);
    }
  }
  this.audio_.load();
};


astoroids.Sound.prototype.play = function(opt_volume) {
  this.load();
  this.audio_.volume = opt_volume || 1;
  this.audio_.play();
};


(function() {
  var _s = new astoroids.Sound('low');
  var _t = new astoroids.Sound('high');
  var _i = 0;
  var _z = 1000;
  var _beep = function() {
    if (_i++ % 2 == 0) {
      _s.play();
    } else {
      _t.play();
    }
    _z -= 10;
    window.setTimeout(_beep, _z > 400 ? _z : 400);
  };
  _beep();
})();
