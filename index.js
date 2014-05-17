
var _ = require("underscore")
  , d3 = require("d3")
  , output = require("./lib/outputSVG")
  , convert = require("./lib/convertImage")
  , path = require("path")
  , outputDir = path.join(__dirname, "output")
  , g2d = require("./lib/2dHelpers")
  , shape = require("./lib/shapeHelpers")
  ;

var padding = 10,
    width = 600,
    height = 900;

var circleB = shape.circle([270,320], 170, 14);
var circleC = shape.circle([670,250], 430, 31);
var circleD = shape.circle([170,50], 530, 31);
var circleE = shape.circle([900,450], 630, 41);
var circleF = shape.circle([1000,250], 330, 52);
var circleG = shape.circle([800,250], 130, 152);
var points = circleB
             .concat(circleC)
             .concat(circleD)
             .concat(circleE)
             .concat(circleF)
             .concat(circleG);

// var points = [
//   [290, 300],
//   [270, 350],
//   [770, 150]
// ];

var xDist = 11
  , yDist = 33
  , i
  ;

for(i = 1; i < 1200; i+= 1){

  var x = (i * xDist) % width
    , y = Math.floor((i * xDist)/width) * yDist
    ;

  x = (Math.random() * 10) + x;

  points.push([x,y]);
}


// var i;
// for(i=0; i < 4; i+=1){

//   var x = (Math.random() * width - 2 * padding) + padding
//     , y = (Math.random() * height - 2 * padding) + padding
//     ;

//   points.push([x,y]);

// }

function removeBadPoints(points){
  return _.filter(points, function(point){
    var x = point[0]
      , y = point[1]
      ;
    return y < height - padding && y > padding && x < width - padding && x > padding;
  });
}

points = removeBadPoints(points);


// OUTPUT STUFF -------------------------------------------


var voronoi = d3.geom.voronoi()
    .clipExtent([[padding, padding], [width - padding, height - padding]]);

var color = d3.scale.category20b();

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var polygons = voronoi(points);

svg.selectAll("path")
    .data(polygons)
  .enter().append("path")
    // .style("fill", function(d, i) { return color(i); })
    .attr("fill", "#fff")
    .attr("stroke", "#ff0000")
    .attr("stroke-width", 2)
    .attr("d", function(d) { return "M" + d.join("L") + "Z"; });

// svg.append("g")
//   .selectAll("circle")
//     .data(points)
//   .enter().append("circle")
//     .style("fill", function(d, i) { return color(i); })
//     .attr("transform", function(d) { return "translate(" + d + ")"; })
//     .attr("r", 4.5);

var txt = d3.select("body").html();

// console.log(txt)

output(txt, outputDir, function(err, file){
  if(err){
    console.log(err);
    return;
  }
  console.log("created:", file);
  convert(file, function(err, jpg){
    console.log("created:", jpg)
  })
});