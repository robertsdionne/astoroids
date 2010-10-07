
goog.provide('astoroids.Thing');

goog.require('astoroids.Aabb');


astoroids.Thing = function(
    opt_x, opt_y, opt_xv, opt_yv, opt_heading, opt_size) {
  this.x = opt_x || 0.0;
  this.y = opt_y || 0.0;
  this.xv = opt_xv || 0.0;
  this.yv = opt_yv || 0.0;
  this.heading = opt_heading || 0.0;
  this.aabb = new astoroids.Aabb(
      this.x, this.y, opt_size || 0.01, opt_size || 0.01);
};


astoroids.Thing.prototype.update = function(strategy) {
  strategy.call(this, this);
};


astoroids.Thing.prototype.collide = function(that) {
  this.aabb.setPosition(this.mod_(this.x), this.mod_(this.y));
  return this.aabb.contains(this.mod_(that.x), this.mod_(that.y));
};


astoroids.Thing.prototype.mod_ = function(x) {
  return x - Math.floor(x);
};
