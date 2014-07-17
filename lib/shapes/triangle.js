
var _ = require("underscore")
  , util = require("util")
  , g2d = require("../utils/2dHelpers.js")
  , Shape = require("./base")
  , forStream = require("../utils/streamHelpers").forStream
  , d3 = require("d3")
  ;

/*
 * Triangle
 * @extends {Shape}
 *
 */

util.inherits(Triangle, Shape);

function Triangle(p1, p2, p3){
  this.a = p1;
  this.b = p2;
  this.c = p3;
  this.init();
}

Triangle.prototype.init = function(){

  // compute vectors for used by contains()
  this.v0 = [this.c[0]-this.a[0],this.c[1]-this.a[1]];
  this.v1 = [this.b[0]-this.a[0],this.b[1]-this.a[1]];

  // store the centroid for later use
  this.centroid = this.getCenter();
}

Triangle.prototype.contains = function (dot) {

  // sources and math help:
  // http://koozdra.wordpress.com/2012/06/27/javascript-is-point-in-triangle/
  // http://www.blackpawn.com/texts/pointinpoly/default.html

  // NOTE:
  // the complex number helpers could be  
  // used here, but since
  // the computations are so trivial
  // it seemed better to avoid
  // all the object creation

  // compute vector specific to this dot
  var v0 = this.v0
    , v1 = this.v1
    , v2 = [dot[0]-this.a[0],dot[1]-this.a[1]]
    ;

  // Compute dot products
  var dot00 = (v0[0]*v0[0]) + (v0[1]*v0[1])
    , dot01 = (v0[0]*v1[0]) + (v0[1]*v1[1])
    , dot02 = (v0[0]*v2[0]) + (v0[1]*v2[1])
    , dot11 = (v1[0]*v1[0]) + (v1[1]*v1[1])
    , dot12 = (v1[0]*v2[0]) + (v1[1]*v2[1])
    ;

  // Compute barycentric coordinates
  var invDenom = 1/ (dot00 * dot11 - dot01 * dot01)
    , u = (dot11 * dot02 - dot01 * dot12) * invDenom
    , v = (dot00 * dot12 - dot01 * dot02) * invDenom
    ;

  // make sure coordinate is in triangle
  return ((u >= 0) && (v >= 0) && (u + v < 1));

};

Triangle.prototype.getCenter = function(){
  // get centroid
  // console.log("Center", g2d.midPoint([0,0],[0,2]))
  return "center";
}

Triangle.prototype.rotate = function(angle, center){
  center = center || this.centroid;
  // 1) rotate all vertices around center
  // 2) call this.init();
}

Triangle.prototype.outlineStream = function(interval){

  interval = interval || 5;

  return forStream(function(idx){
    return [1, idx];
  }, 10);
};

module.exports = function newTriangle (p1, p2, p3) {
  return new Triangle(p1, p2, p3);
}
