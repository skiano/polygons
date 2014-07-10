
var Readable = require('stream').Readable;
var Writable = require('stream').Writable;
var Transform = require('stream').Transform;
var PassThrough = require('stream').PassThrough;

function forStream(action, start, end, increment){
  // for most common case
  // just pass in how many iterations
  if(arguments.length === 2){
    end = start;
    start = 0;
  }

  increment = increment || 1;

  var stream = new Readable({ objectMode : true })
    , i = start 
    ;

  stream._read = function(){
    if(i > end){
      this.push(null);
    } else{
      this.push(action(i))
    }
    i += increment;
  }

  return stream;
}

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

function joinStream(inputs, transforms){
  // check if arguments are arrays
  inputs = (inputs.length) ? inputs : [inputs];
  transforms = (transforms.length) ? transforms : [transforms];

  // set up a collector stream
  var collector = new PassThrough({ objectMode : true });

  // send each of the inputs
  // through all of the transforms
  inputs.forEach(function(input){
    transforms.forEach(function(transform){
      input.pipe(transform).pipe(collector);
    });
  });

  return collector;
}

module.exports.forStream = forStream;
module.exports.filterStream = filterStream;
module.exports.joinStream = joinStream;

