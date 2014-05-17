
var _ = require("underscore")
  , fs = require("fs")
  , path = require("path")
  , moment = require("moment")
  , md5 = require('MD5')
  ;

var docStart = '<?xml version="1.0" encoding="utf-8"?>\n' +
               '<!-- Generator: Adobe Illustrator 15.0.2, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->\n'
               '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n'

function getDefaultName(key){
  var time = new Date()
    , displayTime = moment(time).format("YY.MM.DD.HH.mm.ss");
    ;
  return ["Poly", displayTime, key].join("-");
}

function keyIsAvailable(location, key){
  var files = fs.readdirSync(location);
  return undefined === _.find(files, function(file){
    return file.indexOf(key) !== -1;
  });
}

module.exports = function(svg, location, cb){
  var key = md5(svg)
    , filename = getDefaultName(key)
    , out = path.join(location, filename+".svg")
    ;

  if(keyIsAvailable(location, key)){
    fs.writeFile(out, docStart + svg, function(err){
      return cb(err, out);
    });
  }
  else{
    return cb("File has already been written");
  }
}