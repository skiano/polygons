
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

util.inherits(Triangle, Shape);

function Triangle(p1, p2, p3){
  
  this.p1 = p1;
  this.p2 = p2;
  this.p3 = p3;  

  this.A = g2d.toComplexPoint(p1).finalize();
  this.B = g2d.toComplexPoint(p2).finalize();
  this.C = g2d.toComplexPoint(p3).finalize();

  // for contain check
  // we can compute vectors and dot products 
  // specific to this triangle
  // so they are not recomputed on
  // each check

  this.VX = this.C.subtract(this.A).finalize();
  this.VY = this.B.subtract(this.A).finalize();
  
  this.VXdotVX = g2d.dotProduct(this.VX, this.VX);
  this.VXdotVY = g2d.dotProduct(this.VX, this.VY);
  this.VYdotVY = g2d.dotProduct(this.VY, this.VY);

}

Triangle.prototype.outlineStream = function(interval){

  interval = interval || 5;

  return forStream(function(idx){
    return [1, idx];
  }, 10);
};

Triangle.prototype.contains = function (point) {

  // inspiration and math help:
  // http://koozdra.wordpress.com/2012/06/27/javascript-is-point-in-triangle/
  // http://www.blackpawn.com/texts/pointinpoly/default.html

  // compute vectors and dot products specific to this point

  var P = g2d.toComplexPoint(point).finalize()
    , VP = P.subtract(this.A).finalize()
    , VXdotVP = g2d.dotProduct(this.VX,VP)
    , VYdotVP = g2d.dotProduct(this.VY,VP)
    ;

  // Compute barycentric coordinates

  var denom = (this.VXdotVX * this.VYdotVY  - this.VXdotVY * this.VXdotVY)
    , u = (this.VYdotVY * VXdotVP - this.VXdotVY * VYdotVP) / denom
    , v = (this.VXdotVX * VYdotVP - this.VXdotVY * VXdotVP) / denom
    ;

  return ((u >= 0) && (v >= 0) && (u + v < 1));

};

Triangle.prototype.clip = function (dot) {
  return (g2d.distance(dot, this.center) <= this.radius);
};

Triangle.prototype.punch = function (dot) {
  return (g2d.distance(dot,this.center) >= this.radius);
};

module.exports = function newTriangle (p1, p2, p3) {
  return new Triangle(p1, p2, p3);
}
