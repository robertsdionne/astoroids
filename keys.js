// Copyright 2011 ... All Rights Reserved.

/**
 * @param {Document} document
 * @constructor
 */
astoroids.Keys = function(document) {
  /**
   * @type {Document}
   */
  this.document_ = document;

  /**
   * @type {Object}
   */
  this.keys_ = {};

  /**
   * @type {Object}
   */
  this.oldKeys_ = {};
};


astoroids.Key = {
  FIRE: 32,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40
};


/**
 *
 */
astoroids.Keys.prototype.install = function() {
  this.document_.onkeydown = astoroids.bind(this.handleKeyDown_, this);
  this.document_.onkeyup = astoroids.bind(this.handleKeyUp_, this);
};


astoroids.Keys.prototype.uninstall = function() {
  this.document_.onkeydown = this.document_.onkeyup = null;
};


astoroids.Keys.prototype.handleKeyDown_ = function(event) {
  this.keys_[event.keyCode] = true;
  return true;
};


astoroids.Keys.prototype.handleKeyUp_ = function(event) {
  this.keys_[event.keyCode] = false;
  return true;
};


astoroids.Keys.prototype.isHeld = function(key) {
  return this.isPressed(key) && this.oldKeys_[key];
};


astoroids.Keys.prototype.isPressed = function(key) {
  return this.keys_[key];
};


astoroids.Keys.prototype.justPressed = function(key) {
  return this.isPressed(key) && !this.oldKeys_[key];
};


astoroids.Keys.prototype.justReleased = function(key) {
  return !this.isPressed(key) && this.oldKeys_[key];
};


astoroids.Keys.prototype.update = function() {
  for (var key in this.keys_) {
    this.oldKeys_[key] = this.keys_[key];
  }
};
