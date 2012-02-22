
astoroids.updateAsteroid = function(asteroid) {
  astoroids.updatePosition_(asteroid);
};


astoroids.updateBullet = function(bullet) {
  astoroids.updatePosition_(bullet);
};


astoroids.updateShip = function(ship) {
  astoroids.updatePosition_(ship);
  ship.xv *= 0.995;
  ship.yv *= 0.995;
};


astoroids.updatePosition_ = function(mass) {
  mass.x += mass.xv;
  mass.y += mass.yv;
};
