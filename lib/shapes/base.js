
var _ = require("underscore")
  , filterStream = require("../utils/streamHelpers").filterStream
  ;

/*
 * The base class for other shape
 * Each shape should implement
 * punch and clip 
 * and they will inherit 
 * punchStream and Clip Stream
 *
 * @constructor {Shape}
 *
 */

module.exports = Shape;

var shapeId = 0;

function Shape(){}

// stub if not implemented
Shape.prototype.punch = function (dot) {
  return true;
}

// stub if not implemented
Shape.prototype.punchStream = function (dot) {
  return true;
}

Shape.prototype.clipStream = function () {
  var self = this;
  return filterStream(function(d){
    return self.contains(d);
  });
}

Shape.prototype.punchStream = function () {
  var self = this;
  return filterStream(function(d){
    return !self.contains(d);
  });
}
