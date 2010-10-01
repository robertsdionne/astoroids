
var Key = {
  FIRE: 32,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
};


var Keys = function() {
  this.keys_ = [];
  this.oldKeys_ = [];
  this.element_;
};


Keys.prototype.install = function(element) {
  this.element_ = element;
  this.element_.onkeydown = bind(this.onKeyDown_, this);
  this.element_.onkeyup = bind(this.onKeyUp_, this);
};


Keys.prototype.isDown = function(key) {
  return this.keys_[key];
};


Keys.prototype.isUp = function(key) {
  return !this.keys_[key];
};


Keys.prototype.justDown = function(key) {
  return this.keys_[key] && !this.oldKeys_[key];
};


Keys.prototype.justUp = function(key) {
  return !this.keys_[key] && this.oldKeys_[key];
};


Keys.prototype.onKeyDown_ = function(e) {
  this.keys_[e.keyCode] = true;
  return false;
};


Keys.prototype.onKeyUp_ = function(e) {
  this.keys_[e.keyCode] = false;
  return false;
};


Keys.prototype.update = function() {
  this.oldKeys_ = this.keys_.slice();
};


Keys.prototype.uninstall = function() {
  this.element_.onkeydown = nullFunc;
  this.element_.onkeyup = nullFunc;
  this.element_ = null;
};
