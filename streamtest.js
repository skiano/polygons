var Readable = require('stream').Readable;
var Writable = require('stream').Writable;
var Transform = require('stream').Transform;
var util = require('util');

var circle = require("./lib/shapes/circle");

var filterStream = require("./lib/utils/streamHelpers").filterStream;
var joinStream = require("./lib/utils/streamHelpers").joinStream;
var forStream = require("./lib/utils/streamHelpers").forStream;
var collectStream = require("./lib/utils/streamHelpers").collectStream;
var logStream = require("./lib/utils/streamHelpers").logStream;

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
  console.log("->",data);
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



var c1 = new Counter(12)
  , c2 = new Counter(6)
  , w = new Logger()
  , s = new Skipper(2,"!")
  , s2 = new Skipper(3,"-")
  , even = filterStream(function(n){return n%2 === 0;})
  , threes = filterStream(function(n){return n%3 === 0;})
  , testFor = forStream(function(i){
      console.log("for stream", i)
      return i;
    }, 30, 33);
  ;


var circleA = circle([10,10], 18);
var circleB = circle([20,10], 18);


var points = collectStream();

circleA.outlineStream()
  .pipe(circleB.clipStream())
  .pipe(logStream("A clipped by b"))
  .pipe(points);

circleB.outlineStream()
  .pipe(logStream("b outline"))
  .pipe(points);

points.on("finish", function(){
  console.log(this.data)
})


// c.pipe(s).pipe(w);
// c2.pipe(s2).pipe(w);

// c2.pipe(s).pipe(s2).pipe(w)

// c2.pipe(even).pipe(w)

// c2.pipe(threes).pipe(w)

// c2.pipe(joinStream([even,threes])).pipe(w);

// joinStream([testFor, c2], [threes]).pipe(w)




// testFor.pipe(filterStream(function(n){return n%3 === 0;})).pipe(w)
// c2.pipe(filterStream(function(n){return n%3 === 0;})).pipe(w)


// testFor.pipe(threes).pipe(w)




