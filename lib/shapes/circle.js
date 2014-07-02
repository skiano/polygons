/*
 * Helpful functions for working with dotted shapes
 *
 */

var g2d = require("../utils/2dHelpers.js")
  , _ = require("underscore")
  ;


function Circle(center, radius){

  this.center = center;
  this.radius = radius;
  this.circumfrance = g2d.circumfrance(radius);

  this.boundingBox = [
    [center[0] - radius, center[1] - radius],
    [center[0] + radius, center[1] + radius]
  ]
}

Circle.prototype.outline = function(interval, action){

  var c = this.circumfrance
    , dotCount = Math.floor(c/interval)
    , dotAngle = 360 / dotCount
    , initialPoint = [this.center[0]+this.radius, this.center[1]]
    , dots = []
    , idx
    ;

  for(idx = 0; idx < dotCount; idx += 1){
    action(g2d.rotate(initialPoint, dotAngle*idx, this.center))
  }
};

/*
 * and returns those that are inside the circle
 */

Circle.prototype.clipDot = function(dot, action){
  if(g2d.distance(dot, this.center) <= radius){
    action(dot);
  }
};

/*
 * punch takes a set of dots
 * and returns those that are outside the circle
 *
 * @param {Array} array of [x,y] coordinates
 * @return {Array} array of [x,y] coordinates
 *
 */

Circle.prototype.punchDot = function(dot, action){
  if(g2d.distance(dot,this.center) >= radius){
    action(dot);
  }
};

// Exposing this way to avoid annoying instances 
// of "new" keyword

module.exports = function newCircle(center, radius, interval){
  return new Circle(center, radius);
}
