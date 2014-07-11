
var _ = require("underscore")
  , d3 = require("d3")
  , output = require("./lib/utils/outputSVG")
  , convert = require("./lib/utils/convertImage")
  , path = require("path")
  , outputDir = path.join(__dirname, "output", "day-2")
  , g2d = require("./lib/utils/2dHelpers")
  , frame = require("./lib/frame")
  , circle = require("./lib/shapes/circle")
  , collectStream =  require("./lib/utils/streamHelpers").collectStream;
  ;

var picture = frame(230, 230, 0); // 0 margin

var circleA = circle([115,115], 90);
var circleA2 = circle([115,115], 100);
var circleB = circle([100,120], 60);
var circleC = circle([60,125], 40);
var circleD = circle([130,55], 100);
var circleE = circle([200,115], 120);
var points = collectStream();

var overCircle = circle([130,130], 60);

for(var i = 1; i < 150; i+=1){

  circle([133 - i*10, 145], 160).outlineStream(6)
    .pipe(overCircle.clipStream())
    .pipe(circleC.punchStream())
    .pipe(points);
}


circleA.outlineStream(20)
  .pipe(points);

circleA2.outlineStream(27)
  .pipe(points);

for(var i = 1; i < 10; i+=1){
  circle([145, -190 + i*12], 190).outlineStream(12)
    .pipe(circleA.punchStream())
    .pipe(points);
}


// circleC.outlineStream()
//   .pipe(circleA.clipStream())
//   .pipe(circleB.clipStream())
//   .pipe(points);

// circleB.outlineStream()
//   .pipe(circleA.clipStream())
//   .pipe(points);

// circleA.outlineStream()
//   .pipe(points);

// circleD.outlineStream()
//   .pipe(circleA.punchStream())
//   .pipe(points);

// circleD.outlineStream()
//   .pipe(circleB.clipStream())
//   .pipe(circleC.clipStream())
//   .pipe(points);

// circleE.outlineStream()
//   .pipe(circleB.punchStream())
//   .pipe(points);





// for(var i = 1; i < 30; i+=1){

//   circle([200,115 + i*10], 120).outlineStream()
//     .pipe(circleE.clipStream())
//     .pipe(circleB.punchStream())
//     .pipe(points);
// }

// for(var i = 1; i < 50; i+=1){

//   circle([100,-100 + i*20], 130).outlineStream()
//     .pipe(circleA.punchStream())
//     .pipe(circleD.punchStream())
//     .pipe(points);
// }

// for(var i = 1; i < 50; i+=1){

//   circle([290 - i*10, 100], 130).outlineStream(10)
//     .pipe(circleA.clipStream())
//     .pipe(circleB.punchStream())
//     .pipe(circleE.punchStream())
//     .pipe(points);
// }

points.on("finish", function(){
  picture.addDots(this.data);
  // picture.preview();
  picture.export(outputDir);
});



// shape.circle([50,50],10).outline(10, function(dot){
//   picture.addDot(dot);
// });

// shape.circle([150,150],100).outline(20, function(dot){
//   picture.addDot(dot);
// });

// shape.circle([250,250],100).outline(20, function(dot){
//   picture.addDot(dot);
// });

// picture.preview();
// picture.export(outputDir);