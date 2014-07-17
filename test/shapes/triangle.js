var should = require("should") 
  , _ = require("underscore")
  , makeTriangle = require("../../lib/shapes/triangle")
  ;

describe("Triangle", function(){

  it("should check if a point is inside", function(){

    var t1 = makeTriangle([160,190], [210,90], [70,70]);

    var insidePoints = [
      [100,85],
      [160,170],
      [150,120]
    ];

    var outsidePoints = [
      [-10,-10],
      [200,165],
      [146,179]
    ]

    _.each(insidePoints, function(p){
      t1.contains(p).should.be.true;
    });

    _.each(outsidePoints, function(p){
      t1.contains(p).should.be.false;
    });

  });

  it("should find the centeroid", function(){
    var t1 = makeTriangle([160,190], [210,90], [70,70])
      , expected = [ 146.66666666666666, 116.66666666666666 ]
      , errX = Math.abs(t1.centroid[0] - expected[0])
      , errY = Math.abs(t1.centroid[1] - expected[1])
      ;

    errX.should.be.lessThan(0.01);
    errY.should.be.lessThan(0.01);
  });

});