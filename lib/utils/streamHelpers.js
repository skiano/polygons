
var util = require("util");
var Readable = require('stream').Readable;
var Writable = require('stream').Writable;
var Transform = require('stream').Transform;
var PassThrough = require('stream').PassThrough;

/*
 * forStream
 * creates a readable stream that emmits data using the iterator
 *
 * @param {fuction} iterator The function to call on eac iteration
 * @param {number}  start    the index to start iterating at
 *                           If only two arguments treated as the end argument
 * @param {number}  end      Optional end of iteration
 * @param {number}
 * @return {Stream} Readable Stream 
 *
 */

function forStream(iterator, start, end, increment){
  /*
   * NOTE: 
   * In most cases start is 0 and increment is 1
   * for these cases you can pass only 2 arguments
   * with end as the second argument
   *
   */

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
      this.push(iterator(i))
    }
    i += increment;
  }

  return stream;
}

/*
 * A Transform stream that filters data by a test
 *
 * @param {function} filter The test for each chunl of data (returns true or false)
 * @return {Stream}
 *
 */

function filterStream(filter){
  var stream = new Transform({ objectMode : true });
  stream._maxListeners = 0;
  stream._transform = function(data, encoding, done){
    if(filter(data)){
      this.push(data);  
    }
    done();
  };
  return stream;
}

/*
 * A Transform stream that applys function to each
 *
 * @param {function} action
 * @return {Stream}
 *
 */

function eachStream(action){
  var stream = new Transform({ objectMode : true });
  stream._maxListeners = 0;
  stream._transform = function(data, encoding, done){
    this.push(action(data));  
    done();
  };
  return stream;
}

/*
 * A writable stream that stores data for access on "finish"
 * @extends {Stream.Writable}
 *
 */

util.inherits(Collector, Writable);

function Collector () {
  Writable.call(this, { objectMode : true });
  // allow infinite pipes to write to this
  this._maxListeners = 0;
  this.data = [];
}  

Collector.prototype._write = function (data, encoding, done) {
  this.data.push(data);
  done();
};

/*
 * Exposes constructor in a way
 * that matches other stream helpers
 *
 * @return {Stream} 
 *
 */

function collectStream(){
  return new Collector();
}

/*
 * A transform stream that logs data as it comes through the pipe
 * @param {number} text The text to be prepended in the log
 * @return {Stream} 
 *
 */

function logStream(text){
  text = text || "->";
  var stream = new Transform({ objectMode : true });
  stream._maxListeners = 0;
  stream._transform = function(data, encoding, done){
    console.log(text,data);
    this.push(data);
    done();
  };
  return stream;
}

// Expose Functionality

module.exports.forStream = forStream;
module.exports.filterStream = filterStream;
module.exports.eachStream = eachStream;
module.exports.collectStream = collectStream;
module.exports.logStream = logStream;

