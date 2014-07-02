
var _ = require("underscore")
  , d3 = require("d3")
  , output = require("./lib/utils/outputSVG")
  , convert = require("./lib/utils/convertImage")
  , path = require("path")
  , outputDir = path.join(__dirname, "output", "day-2")
  , g2d = require("./lib/utils/2dHelpers")
  , shape = require("./lib/shapes/")
  , frame = require("./lib/frame/")
  ;

var picture = frame(200, 200, 10);

shape.circle([50,50],10).outline(10, function(dot){
  picture.addDot(dot);
});

shape.circle([150,150],100).outline(20, function(dot){
  picture.addDot(dot);
});

shape.circle([250,250],100).outline(20, function(dot){
  picture.addDot(dot);
});

picture.preview();
picture.export(outputDir);