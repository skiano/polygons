
var exec = require('child_process').exec
  ;

module.exports = function(input, cb){
  var output = input.replace(/svg$/gi,"jpg");
  exec("convert " + input + " " + output, function (error, stdout, stderr) {
    if(typeof cb === "function"){
      cb(error || stderr, output)  
    }
  });
}