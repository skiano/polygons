
var _ = require("underscore")
  , d3 = require("d3")
  , output = require("./lib/utils/outputSVG")
  , convert = require("./lib/utils/convertImage")
  , path = require("path")
  , outputDir = path.join(__dirname, "output", "day-4")
  , g2d = require("./lib/utils/2dHelpers")
  , frame = require("./lib/frame")
  , circle = require("./lib/shapes/circle")
  , triangle = require("./lib/shapes/triangle")
  , collectStream = require("./lib/utils/streamHelpers").collectStream
  , eachStream = require("./lib/utils/streamHelpers").eachStream
  , logStream = require("./lib/utils/streamHelpers").logStream
  , funnelStream = require("./lib/utils/streamHelpers").funnelStream;
  ;


function randRange(start, end){
  if(!end){
    end = start
    start = 0;
  }
  return Math.floor(Math.random()*(end-start)) + start;
}

var rotateAngle = randRange(-100,100);
var rotateAngle2 = randRange(-100,100);



var picture = frame(600, 600, 10); // 0 margin



var funnel = funnelStream();
var points = funnelStream();
var finalPoints = collectStream();
var centerX = randRange(200,230);
var centerY = randRange(200,400);

var interval = randRange(10,40)


for(var i = 1; i < 40; i+=1){

  var centerPoint = [centerX+randRange(-5,5), centerY+randRange(-5,5)];
  var angle = randRange(-10,10);

  var rotate = eachStream(function(dot){
    return g2d.rotate(dot, angle, centerPoint);
  });

  circle(centerPoint, i*interval + randRange(-interval/2,interval/2)).outlineStream(randRange(5,25))
    // .pipe(rotate)
    .pipe(funnel)
    ;

}

// Making a target

var concentricCenter = [randRange(0,400),randRange(0,600)];
var radius = randRange(200,400);
var interval = randRange(10,40);
var outerCircle = circle(concentricCenter,radius);

var misbehave = randRange(10) * 2;

funnel
  .pipe(outerCircle.punchStream())
  .pipe(points)

outerCircle.outlineStream(interval)
  .pipe(points)

for(var i = 1; i < randRange(2,7); i+=1){

  var currentCenter = [
                      concentricCenter[0]+randRange(-misbehave,misbehave), 
                      concentricCenter[1]+randRange(-misbehave,misbehave)
                      ];

  radius = radius * 0.8;
  var clipCircle = circle(currentCenter, radius);

  radius = radius * 0.8;
  var punchCircle = circle(currentCenter, radius);

  funnel
    .pipe(clipCircle.clipStream())
    .pipe(punchCircle.punchStream())
    .pipe(points)

  clipCircle.outlineStream(randRange(10,40))
    .pipe(points)

  punchCircle.outlineStream(randRange(10,40))
    .pipe(points)

}

var innerCircle = circle(concentricCenter,radius*.8);

funnel
  .pipe(innerCircle.clipStream())
  .pipe(points)

innerCircle.outlineStream(interval)
  .pipe(points)


var detail = randRange(50,100);
var amplify = randRange(120, 400);
var start = randRange(-100,100);

var detailY = randRange(50,100);
var amplifyY = randRange(60, 200);
var startY = randRange(-100,100);

var t1 = triangle(
          [0,picture.height-10],
          [picture.width,picture.height-10],
          [picture.width/2,10]
         );

points
  // .pipe(eachStream(function(dot){
  //   var squashX = 20;
  //   var squashY = 20;
  //   return([ Math.floor(dot[0]) - Math.floor(dot[0]) % squashX , Math.ceil(dot[1]) - Math.ceil(dot[1]) % squashY])
  // }))
  .pipe(eachStream(function(dot){
    var shiftX = Math.sin((dot[1]+start)/detail)*amplify;
    return([dot[0]+shiftX, dot[1]])
  }))
  .pipe(t1.punchStream())
  .pipe(finalPoints)

finalPoints.on("finish", function(){
  picture.addDots(this.data);
  picture.export(outputDir);
});

