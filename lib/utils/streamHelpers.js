
var Readable = require('stream').Readable;
var Writable = require('stream').Writable;
var Transform = require('stream').Transform;
var PassThrough = require('stream').PassThrough;




function filterStream(filter){
  var stream = new Transform({ objectMode : true });
  stream._transform = function(data, encoding, done){
    if(filter(data)){
      this.push(data);  
    }
    done();
  };
  return stream;
}

function joinStream(input, filters){
  var collector = new PassThrough({ objectMode : true });

  filters.forEach(function(filter){
    input.pipe(filter).pipe(collector);
  });

  return collector;
}

module.exports.filterStream = filterStream;
module.exports.joinStream = joinStream;