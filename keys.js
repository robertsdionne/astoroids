// Copyright 2010.

goog.provide('astoroids.Key');
goog.provide('astoroids.Keys');

goog.require('goog.events');
goog.require('goog.events.KeyHandler');


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
  this.handler_ = new goog.events.KeyHandler();
};


astoroids.Keys.prototype.install = function(element) {
  this.element_ = element;
  this.handler_.attach(element);
  goog.events.listen(
      this.handler_, 'key', goog.bind(this.onKeyDown_, this));
  goog.events.listen(
      this.element_, 'keyup', goog.bind(this.onKeyUp_, this));
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
};


astoroids.Keys.prototype.onKeyUp_ = function(e) {
  this.keys_[e.keyCode] = false;
};


astoroids.Keys.prototype.update = function() {
  this.oldKeys_ = this.keys_.slice();
};


astoroids.Keys.prototype.uninstall = function() {
  goog.events.removeAll(this.element_);
  this.handler_.detach();
  this.element_ = null;
};
