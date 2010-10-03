// Copyright 2010.

goog.provide('astoroids.Key');
goog.provide('astoroids.Keys');


astoroids.Key = {
  FIRE: 32,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
};


astoroids.Keys = function() {
  this.keys_ = [];
  this.oldKeys_ = [];
  this.element_;
};


astoroids.Keys.prototype.install = function(element) {
  this.element_ = element;
  this.element_.onkeydown = goog.bind(this.onKeyDown_, this);
  this.element_.onkeyup = goog.bind(this.onKeyUp_, this);
};


astoroids.Keys.prototype.isDown = function(key) {
  return this.keys_[key];
};


astoroids.Keys.prototype.isUp = function(key) {
  return !this.keys_[key];
};


astoroids.Keys.prototype.justDown = function(key) {
  return this.keys_[key] && !this.oldKeys_[key];
};


astoroids.Keys.prototype.justUp = function(key) {
  return !this.keys_[key] && this.oldKeys_[key];
};


astoroids.Keys.prototype.onKeyDown_ = function(e) {
  this.keys_[e.keyCode] = true;
  return false;
};


astoroids.Keys.prototype.onKeyUp_ = function(e) {
  this.keys_[e.keyCode] = false;
  return false;
};


astoroids.Keys.prototype.update = function() {
  this.oldKeys_ = this.keys_.slice();
};


astoroids.Keys.prototype.uninstall = function() {
  this.element_.onkeydown = goog.nullFunc;
  this.element_.onkeyup = goog.nullFunc;
  this.element_ = null;
};
