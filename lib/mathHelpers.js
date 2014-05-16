
/*
 * Helpful functions for working with coordinates
 *
 */

var complex = require("Complex");

function toRadians(degrees){
  return degrees * (Math.PI/180);
}

function toDegrees(radians){
  return radians * (180/Math.PI);
}

function toCoordinate(complex){
  return [complex.real, complex.im];
}

function toComplexPoint(point){
  return complex.from(point[0],point[1]);
}

function toComplexAngle(degrees){
  return complex.from(
         Math.cos(toRadians(degrees)), 
         Math.sin(toRadians(degrees))
         );
}

function rotate(point, degrees, origin){
  // http://nklein.com/2009/06/complex-numbers-for-rotating-translating-and-scaling-the-plane/
  origin = origin || [0,0];
  var cOrigin = toComplexPoint(origin) 
    , cPoint = toComplexPoint(point)
    , cAngle = toComplexAngle(degrees)
    , result = cPoint.subtract(cOrigin).multiply(cAngle).add(cOrigin)
    ;
  return toCoordinate(result);
}

module.exports.toRadians = toRadians;
module.exports.toDegrees = toDegrees;
module.exports.toComplexPoint = toComplexPoint;
module.exports.toComplexAngle = toComplexAngle;
module.exports.rotate = rotate;