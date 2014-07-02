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

Circle.prototype.outline = function(interval){

  var c = this.circumfrance
    , dotCount = Math.floor(c/interval)
    , dotAngle = 360 / dotCount
    , initialPoint = [this.center[0]+this.radius, this.center[1]]
    , dots = []
    , idx
    ;

  for(idx = 0; idx < dotCount; idx += 1){
    dots.push(g2d.rotate(initialPoint, dotAngle*idx, this.center))
  }

  return dots;
};

/*
 * clip takes a set of dots
 * and returns those that are inside the circle
 *
 * @param {Array} array of [x,y] coordinates
 * @return {Array} array of [x,y] coordinates
 *
 */

Circle.prototype.clip = function(dots){
  var self = this;

  return _.filter(dots, function(dot){
    return g2d.distance(dot,self.center) <= radius;
  });
};

/*
 * punch takes a set of dots
 * and returns those that are outside the circle
 *
 * @param {Array} array of [x,y] coordinates
 * @return {Array} array of [x,y] coordinates
 *
 */

Circle.prototype.punch = function(dots){
  var self = this;

  return _.filter(dots, function(dot){
    return g2d.distance(dot,self.center) >= radius;
  });
};

module.exports = function circle(center, radius, interval){
  
  var circle = new Circle(center, radius);

  return circle.outline(interval);

}