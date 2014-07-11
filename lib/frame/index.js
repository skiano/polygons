
var _ = require("underscore")
  , d3 = require("d3")
  , output = require("../utils/outputSVG")
  , convert = require("../utils/convertImage")
  ;

Frame = function(width, height, marginX, marginY){
  this.dots = [];
  this.width = width;
  this.height = height;
  this.marginX = marginX || 0;
  this.marginY = marginY || this.marginX;
  this.left = this.marginX;
  this.right = this.width - this.marginX;
  this.top = this.marginY;
  this.bottom = this.height - this.marginY;
  this.boundingBox = [
                      [this.left, this.top], 
                      [this.right, this.bottom]
                     ];
}

Frame.prototype.preview = function(){
  //ascii representation?????
  console.log("PREVIEW:\n",this.dots);
}

Frame.prototype.addDot = function(dot){
  if( dot[1] <= this.bottom && dot[1] >= this.top 
      && dot[0] <= this.right && dot[0] >= this.left ){
    this.dots.push(dot);
  }
}

Frame.prototype.addDots = function(dots){
  var self = this;
  dots.forEach(function(dot){
    self.addDot(dot)
  });
}

Frame.prototype.export = function(directory, cb){

  var svg = this.drawEdges();

  output(svg, directory, function(err, file){
    if(err){
      console.log(err);
      return;
    }
    console.log("created:", file);
    convert(file, function(err, jpg){
      console.log("created:", jpg)
    });

    if(cb){
      cb(svg);  
    }
  });
}

Frame.prototype.drawEdges = function(){

  var voronoi = d3.geom.voronoi().clipExtent(this.boundingBox)
    , polygons = voronoi(this.dots)
    ;

  var svg = d3.select("body").append("svg")
    .attr("width", this.width)
    .attr("height", this.height);

  // svg.selectAll("path")
  //     .data(polygons)
  //   .enter().append("path")
  //     // .style("fill", function(d, i) {
  //     //   return color(i);
  //     //   var polygon = d3.geom.polygon(d)
  //     //     , area = polygon.area(d)
  //     //     , c = color(area)
  //     //     , control = d3.rgb(c)
  //     //     ;
  //     //   return area > 1000 ? control : control.brighter(4);
  //     // })
  //     .attr("fill", "#111ff7")
  //     .attr("stroke", "#eee")
  //     .attr("stroke-width", 2)
  //     .attr("d", function(d) { return "M" + d.join("L") + "Z"; });

  svg.append("g")
    .selectAll("circle")
      .data(this.dots)
    .enter().append("circle")
      .style("fill", "red")
      .attr("transform", function(d) { return "translate(" + d + ")"; })
      .attr("r", 1);

  // return the svg
  return d3.select("body").html();
}

module.exports = function(width, height, margin){
  return new Frame(width, height, margin);
}
