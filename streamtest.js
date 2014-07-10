var Readable = require('stream').Readable;
var Writable = require('stream').Writable;
var Transform = require('stream').Transform;
var util = require('util');


var filterStream = require("./lib/utils/streamHelpers").filterStream;
var joinStream = require("./lib/utils/streamHelpers").joinStream;

// Test Reader

util.inherits(Counter, Readable);

function Counter(max) {
  Readable.call(this, { objectMode : true });
  this._max = max || 3;
  this._index = 1;
}

Counter.prototype._read = function() {
  var i = this._index++
    , v = (i <= this._max) ? i : null;
    ;
  console.log("reader", i)
  this.push(v);
};


// Test Writer

util.inherits(Logger, Writable);

function Logger () {
  Writable.call(this, { objectMode : true });
}

Logger.prototype._write = function (data, encoding, done) {
  console.log(data);
  done();
};

// Test Trasformer

util.inherits(Skipper, Transform);

function Skipper(inc, letter) {
  inc = inc || 2;
  Transform.call(this, { objectMode : true });
  this.inc = inc;
  this.letter = letter;
}

Skipper.prototype._transform = function(data, encoding, done){
  var self = this;
  var number = parseInt(data.toString());
  if(number%this.inc === 0){
    self.push(number);  
  }
  done();
}


// Test Filter



var c = new Counter(5)
  , c2 = new Counter(20)
  , w = new Logger()
  , s = new Skipper(2,"!")
  , s2 = new Skipper(3,"-")
  , even = filterStream(function(n){return n%2 === 0;})
  , threes = filterStream(function(n){return n%3 === 0;})
  ;


// c.pipe(s).pipe(w);
// c2.pipe(s2).pipe(w);

// c2.pipe(s).pipe(s2).pipe(w)

// c2.pipe(even).pipe(w)

// c2.pipe(threes).pipe(w)

// c2.pipe(joinStream([even,threes])).pipe(w);

joinStream(c2, [even,threes]).pipe(w)



