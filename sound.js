// Copyright 2010 Robert Scott Dionne. All Rights Reserved.

/**
 * @fileoverview
 * @author robertsdionne@gmail.com (Robert Scott Dionne)
 */

var Sound = function(src) {
  /**
   * @type {string}
   */
  this.src_ = src;

  /**
   * @type {Audio}
   */
  this.audio_;
};


Sound.prototype.load = function() {
  if (!this.audio_) {
    this.audio_ = new Audio();
    this.audio_.src = this.src_;
  }
  this.audio_.load();
};


Sound.prototype.play = function() {
  this.load();
  this.audio_.play();
};
var _s = new Sound(
    navigator.userAgent.indexOf('Chrome') > -1 ? 'sound/ogg/low.ogg'
        : 'sound/wav/low.wav');
var _t = new Sound(
    navigator.userAgent.indexOf('Chrome') > -1 ? 'sound/ogg/high.ogg'
        : 'sound/wav/high.wav');
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
