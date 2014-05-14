
var fs = require("fs")
  , path = require("path")
  ;

var docStart = '<?xml version="1.0" encoding="utf-8"?>\n' + 
               '<!-- Generator: Adobe Illustrator 15.0.2, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->\n'
               '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n'

function getDefaultName(){
  return "test";
}

module.exports = function(svg, location, filename){
  filename = filename || getDefaultName();
  fs.writeFile(path.join(location, filename+".svg"), docStart + svg);
}