
astoroids.Aabb = function(x, y, width, height) {
  this.setPosition(x, y);
  this.setSize(width, height);
};


astoroids.Aabb.prototype.contains = function(x, y) {
  var minX = this.x_ - this.width_ / 2;
  var maxX = this.x_ + this.width_ / 2;
  var minY = this.y_ - this.height_ / 2;
  var maxY = this.y_ + this.height_ / 2;
  return minX <= x && x <= maxX &&
         minY <= y && y <= maxY;
};


astoroids.Aabb.prototype.setPosition = function(x, y) {
  this.x_ = x;
  this.y_ = y;
};


astoroids.Aabb.prototype.setSize = function(width, height) {
  this.width_ = width;
  this.height_ = height;
};
