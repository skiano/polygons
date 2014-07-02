var Readable = require('stream').Readable;
var Writable = require('stream').Writable;
var util = require('util');

util.inherits(Counter, Readable);

function Counter(opt) {
  Readable.call(this, opt);
  this._max = 1000000;
  this._index = 1;
}

Counter.prototype._read = function() {
  var i = this._index++;
  if (i > this._max)
    this.push(null);
  else {
    var str = '' + i;
    var buf = new Buffer(str, 'ascii');
    this.push(buf);
  }
};

util.inherits(myWriter, Writable);

function myWriter () {
  Writable.call(this, { objectMode : true });
}



myWriter.prototype._write = function (data, encoding, done) {
  console.log(data);
  done();
};




var c = new Counter
  , w = new myWriter
  ;

c.pipe(w)

// c.on("data", function(data){

//   console.log(data.toString())
// })

