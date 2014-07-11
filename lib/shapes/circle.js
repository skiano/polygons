
var _ = require("underscore")
  , util = require("util")
  , g2d = require("../utils/2dHelpers.js")
  , Shape = require("./base")
  , forStream = require("../utils/streamHelpers").forStream
  ;

/*
 * Circle
 * @extends {Shape}
 *
 */

util.inherits(Circle, Shape);

function Circle(center, radius){
  this.center = center;
  this.radius = radius;
  this.circumfrance = g2d.circumfrance(radius);

  this.boundingBox = [
    [center[0] - radius, center[1] - radius],
    [center[0] + radius, center[1] + radius]
  ]
}

Circle.prototype.outlineStream = function(interval){

  interval = interval || 5;

  var self = this
    , c = this.circumfrance
    , dotCount = Math.floor(c/interval)
    , dotAngle = 360 / dotCount
    , initialPoint = [this.center[0]+this.radius, this.center[1]]
    , dots = []
    , idx
    ;

  return forStream(function(idx){
    return g2d.rotate(initialPoint, dotAngle*idx, self.center)
  }, dotCount - 1);
};

Circle.prototype.clip = function (dot) {
  return (g2d.distance(dot, this.center) <= this.radius);
};

Circle.prototype.punch = function (dot) {
  return (g2d.distance(dot,this.center) >= radius);
};

module.exports = function newCircle (center, radius, interval) {
  return new Circle(center, radius);
}
