
var _ = require("underscore")
  , d3 = require("d3")
  , output = require("./lib/utils/outputSVG")
  , convert = require("./lib/utils/convertImage")
  , path = require("path")
  , outputDir = path.join(__dirname, "output")
  , g2d = require("./lib/utils/2dHelpers")
  , shape = require("./lib/shapes/")
  ;

var padding = 10,
    width = 800,
    height = 1200;

var points = [];

// var circleB = shape.circle([270,320], 170, 14);
// var circleC = shape.circle([670,250], 430, 31);
// var circleD = shape.circle([170,50], 530, 31);
// var circleE = shape.circle([900,450], 630, 41);
// var circleF = shape.circle([1000,250], 330, 52);
// var circleG = shape.circle([800,250], 130, 152);
// var points = circleB
//              .concat(circleC)
//              .concat(circleD)
//              .concat(circleE)
//              .concat(circleF)
//              .concat(circleG);


for(var i = 0; i < _.random(1,19); i += 1){

  var center = [_.random(-width, width*2),_.random(-height, height*2)]
    , radius = _.random(20, 2000)
    , space = _.random(10, 290)
    , circle = shape.circle(center, radius, space)
    ;

  points = points.concat(circle)
}

// var points = [
//   [290, 300],
//   [270, 350],
//   [770, 150]
// ];

var xDist = _.random(8,361)
  , yDist = _.random(21,461)
  , i
  ;

for(i = 1; i < _.random(200, 1200); i+= 1){

  var x = (i * xDist) % width
    , y = height - Math.floor((i * xDist)/width) * yDist
    ;

  // wiggle
  x = (Math.random() * 5) + x;
  y = (Math.random() * 5) + y;

  points.push([x,y]);
}


// var i;
// for(i=0; i < 400; i+=1){

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
    // .style("fill", function(d, i) {
    //   return color(i);
    //   var polygon = d3.geom.polygon(d)
    //     , area = polygon.area(d)
    //     , c = color(area)
    //     , control = d3.rgb(c)
    //     ;
    //   return area > 1000 ? control : control.brighter(4);
    // })
    .attr("fill", "#111ff7")
    .attr("stroke", "#eee")
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

// output(txt, outputDir, function(err, file){
//   if(err){
//     console.log(err);
//     return;
//   }
//   console.log("created:", file);
//   convert(file, function(err, jpg){
//     console.log("created:", jpg)
//   })
// });