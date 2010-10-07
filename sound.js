// Copyright 2010 Robert Scott Dionne. All Rights Reserved.

/**
 * @fileoverview
 * @author robertsdionne@gmail.com (Robert Scott Dionne)
 */

goog.provide('astoroids.Sound');


astoroids.Sound = function(name, opt_count) {
  /**
   * @type {string}
   */
  this.name_ = name;

  this.count_ = opt_count || 1;


  this.next_ = 0;

  /**
   * @type {Audio}
   */
  this.audio_ = [];
};


astoroids.Sound.OGG_FORMAT = 'sound/ogg/%s.ogg';


astoroids.Sound.WAV_FORMAT = 'sound/wav/%s.wav';


astoroids.Sound.prototype.load = function() {
  if (this.audio_.length < this.count_) {
    for (var i = 0; i < this.count_; ++i) {
      this.audio_[i] = new Audio();
      if (navigator.userAgent.indexOf('Chrome') > -1) {
        this.audio_[i].src =
            astoroids.Sound.OGG_FORMAT.replace('%s', this.name_);
      } else {
        this.audio_[i].src =
            astoroids.Sound.WAV_FORMAT.replace('%s', this.name_);
      }
    }
  }
  this.audio_[this.next_].load();
};


astoroids.Sound.prototype.play = function(opt_volume) {
  this.load();
  this.audio_[this.next_].volume = opt_volume || 1;
  this.audio_[this.next_].play();
  this.next_ = (this.next_ + 1) % this.count_;
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
