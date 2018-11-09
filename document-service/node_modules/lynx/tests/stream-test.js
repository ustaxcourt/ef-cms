var Stream       = require('stream')
  , macros       = require('./macros')
  , lynx         = macros.lynx
  , port         = macros.udpServerPort
  , udpServer    = macros.udpServer
  , test         = macros.test
  , fixture_send = require('./fixtures/stream-send.json')
  , fixture_recv = require('./fixtures/stream-recv.json')
  ;

var server = udpServer(function () {});

//
// ### function createDelayedStream()
//
// Creates a stream that reads stuff in fixtures and emits each line every
// 10ms or so
//
function createDelayedStream() {
  //
  // Make a new plain vanilla readable stream
  //
  var delayed_stream      = new Stream();
  delayed_stream.readable = true;

  //
  // Set an interval to emit every 10ms or so
  //
  var interval = setInterval(function () {
    var current = fixture_send.shift();
    if(current) {
      //
      // Emit the current stream
      //
      delayed_stream.emit('data', current);
    }
    else {
      //
      // We have nothing else to emit, so close this thing
      //
      delayed_stream.emit('end');
      clearInterval(interval);
    }
  }, 10);

 return delayed_stream;
}

//
// ### function createTestStream(t)
// #### @t {Object} A tap test assertion
//
// Tests if the things being passed to this stream match expectations
//
function createTestStream(t) {
  //
  // Make a new plain vanilla writable stream
  //
  var test_stream      = new Stream();
  test_stream.writable = true;

  //
  // Handle `Stream.prototype.write`
  //
  test_stream.write = function (buf) {
    var expected = fixture_recv.shift();
    t.equal(expected, buf.toString(), ' should be equal to ' + expected);
    if(fixture_recv.length === 0) {
      test_stream.end();
    }
  };

  //
  // Handle `Stream.prototype.end`
  // And we should end our tests here
  //
  //
  test_stream.end = function end(buf) {

    if (arguments.length) {
      test_stream.write(buf);
    }

    //
    // Close our server socket
    //
    server.close();

    //
    // End our little experiment
    //
    test_stream.writable = false;
    t.end();
  };

  //
  // Handle `Stream.prototype.destroy`
  //
  test_stream.destroy = function () {
    test_stream.writable = false;
  };

  return test_stream;
}

test('streams', function (t) {
  //
  // ### function on_error(err)
  // #### @err {Error} Error object
  //
  // Assertion to run if we get any errors
  //
  function on_error(err) {
    t.equal({}, err, "didn't expect any errors");
    //
    // End early
    //
    t.end();
  }

  //
  // Our connection
  //
  var conn = new lynx('localhost', port, {on_error: on_error});

  createDelayedStream()
    .pipe(conn)
    .pipe(createTestStream(t))
    ;
});