var Readable = require('stream').Readable;
var Writable = require('stream').Writable;
var Transform = require('stream').Transform;
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

util.inherits(MyTransformer, Transform);

function MyTransformer() {
  Transform.call(this, { objectMode : true });
}

MyTransformer.prototype._transform = function(data, encoding, done){
  var self = this;
  // var number = parseInt(data.toString());
  var number = parseInt(data.toString())
  if(number%10 === 0){
    self.push(number);  
  }
  
  done();
}




var c = new Counter()
  , w = new myWriter()
  , t = new MyTransformer()
  ;

c.pipe(t).pipe(w)

// c.on("data", function(data){

//   console.log(data.toString())
// })

