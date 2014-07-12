
var _ = require("underscore")
  , d3 = require("d3")
  , output = require("./lib/utils/outputSVG")
  , convert = require("./lib/utils/convertImage")
  , path = require("path")
  , outputDir = path.join(__dirname, "output", "day-3")
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

var picture = frame(630, 630, 10); // 0 margin
var funnel = funnelStream();
var points = collectStream();

var center = [picture.width/2, picture.height/2];
var rotateAngle = randRange(-40,40);
var rotateAngle2 = randRange(-40,40);

function wiggleCenter(amount){
  return [
    center[0] + randRange(-amount,amount),
    center[1] + randRange(-amount,amount)
  ]
}

// Base Circle

circle(wiggleCenter(6), randRange(200,230))
  .outlineStream(randRange(3, 60))
  .pipe(points);

// Interferance

circle([
    randRange(-picture.width,  picture.width*2), 
    randRange(-picture.height, picture.height*2)], 
    randRange(150,430)
  )
  .outlineStream(randRange(15,40))
  .pipe(points);

// Circle Body

funnel
  .pipe(circle(center, randRange(200,230)).clipStream())
  .pipe(circle([randRange(100,500), randRange(100,500)], randRange(20,300)).punchStream())
  .pipe(points);

var overCircle = circle(wiggleCenter(20), randRange(100,160));
var overCircle2 = circle(wiggleCenter(20), randRange(130,200));

for(var i = 1; i < randRange(10,100); i+=1){

  var c = circle(
            [315, randRange(-300,100) + i*30 + randRange(-25,25)], 
            randRange(200,340)
            );

  var rotate = eachStream(function(dot){
    return g2d.rotate(dot, rotateAngle + i, [230, 315]);
  });

  c.outlineStream(randRange(10,20))
    .pipe(overCircle.clipStream())
    .pipe(rotate)
    .pipe(funnel);

  var rotate2 = eachStream(function(dot){
    return g2d.rotate(dot, rotateAngle + i*4, [230, 315]);
  });

  c.outlineStream(randRange(4,15))
    .pipe(overCircle2.punchStream())
    .pipe(rotate2)
    .pipe(funnel);
}

points.on("finish", function(){
  picture.addDots(this.data);
  picture.export(outputDir);
});
