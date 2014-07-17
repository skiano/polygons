
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

  // for checking inside
  // creates 'axis' for 'barycentric coordinates'
  this.VX = this.C.subtract(this.A);
  this.VY = this.B.subtract(this.A);

}

Triangle.prototype.outlineStream = function(interval){

  interval = interval || 5;

  return forStream(function(idx){
    return [1, idx];
  }, 10);
};

Triangle.prototype.contains = function (point) {

  // return true;

  // P = A + u * vX + v * vY
  // like a plus how far in the two directions

  // sources:
  // http://koozdra.wordpress.com/2012/06/27/javascript-is-point-in-triangle/
  // http://www.blackpawn.com/texts/pointinpoly/default.html

  // var P = g2d.toComplexPoint(point);

  var ax = this.p1[0]
    , ay = this.p1[1]
    , bx = this.p2[0]
    , by = this.p2[1]
    , cx = this.p3[0]
    , cy = this.p3[1]
    , px = point[0]
    , py = point[1]
    ;

  // compute vectors

  var v0 = [cx-ax,cy-ay]
    , v1 = [bx-ax,by-ay]
    , v2 = [px-ax,py-ay]
    ;

  // Compute dot products

  var dot00 = (v0[0]*v0[0]) + (v0[1]*v0[1])
    , dot01 = (v0[0]*v1[0]) + (v0[1]*v1[1])
    , dot02 = (v0[0]*v2[0]) + (v0[1]*v2[1])
    , dot11 = (v1[0]*v1[0]) + (v1[1]*v1[1])
    , dot12 = (v1[0]*v2[0]) + (v1[1]*v2[1])
    ;

  // Compute barycentric coordinates
  var invDenom = 1/ (dot00 * dot11 - dot01 * dot01);
  var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
  var v = (dot00 * dot12 - dot01 * dot02) * invDenom;

  console.log(v2)

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
