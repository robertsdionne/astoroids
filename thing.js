
goog.provide('astoroids.Thing');


astoroids.Thing = function(opt_x, opt_y, opt_xv, opt_yv, opt_heading) {
  this.x = opt_x || 0.0;
  this.y = opt_y || 0.0;
  this.xv = opt_xv || 0.0;
  this.yv = opt_yv || 0.0;
  this.heading = opt_heading || 0.0;
};


astoroids.Thing.prototype.update = function(strategy) {
  strategy.apply(this);
};
