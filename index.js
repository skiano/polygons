
var _ = require("underscore")
  , d3 = require("d3")
  , output = require("./lib/utils/outputSVG")
  , convert = require("./lib/utils/convertImage")
  , path = require("path")
  , outputDir = path.join(__dirname, "output", "day-2")
  , g2d = require("./lib/utils/2dHelpers")
  , frame = require("./lib/frame")
  , circle = require("./lib/shapes/circle")
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



var picture = frame(430, 630, 10); // 0 margin



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
var amplify = randRange(60, 400);
var start = randRange(-100,100)
points
  // .pipe(eachStream(function(dot){

  //   // var squashX = Math.floor(Math.sqrt(dot[0]));
  //   // var squashY = Math.floor(Math.sqrt(dot[1]));
  //   var squashX = 2;
  //   var squashY = 3;

  //   return([ Math.floor(dot[0]) - Math.floor(dot[0]) % squashX , Math.ceil(dot[1]) - Math.ceil(dot[1]) % squashY])
  // }))
  // // .pipe(circle([200,200],200).clipStream())
  // .pipe(eachStream(function(dot){
  //   return([dot[0]*1.3, dot[1]*.6])
  // }))
  .pipe(eachStream(function(dot){
    var shift = Math.sin((dot[1]+start)/detail)*amplify;
    return([dot[0]+shift, dot[1]])
  }))
  .pipe(finalPoints)



// circle(center, randRange(200,230)).outlineStream(randRange(10, 30)).pipe(points);

// circle([randRange(100,300), randRange(100,500)], randRange(100,430)).outlineStream(15).pipe(points);

// funnel
//   .pipe(circle(center, randRange(200,230)).clipStream())
//   .pipe(circle([randRange(100,300), randRange(100,500)], randRange(20,300)).punchStream())
//   .pipe(points);

// var overCircle = circle([215,200], randRange(100,160));
// var overCircle2 = circle([randRange(165,245),randRange(100,300)], randRange(130,200));

// for(var i = 1; i < randRange(10,100); i+=1){

//   var c = circle([215, randRange(-300,100) + i*30 + randRange(-25,25)], randRange(300,310));

//   var rotate = eachStream(function(dot){
//     return g2d.rotate(dot, rotateAngle + i, [230, 315]);
//   });
//   var rotate2 = eachStream(function(dot){
//     return g2d.rotate(dot, rotateAngle + i*4, [230, 315]);
//   });

//   c.outlineStream(randRange(10,20))
//     .pipe(overCircle.clipStream())
//     .pipe(rotate)
//     .pipe(funnel);

//   c.outlineStream(randRange(4,15))
//     .pipe(overCircle2.punchStream())
//     .pipe(rotate2)
//     .pipe(funnel);
// }


finalPoints.on("finish", function(){
  picture.addDots(this.data);
  // picture.preview();
  picture.export(outputDir);
});