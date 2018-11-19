var macros     = require('./macros')
  , statsd     = require('statsd-parser')
  , lynx       = macros.lynx
  , test       = macros.test
  , udpServer  = macros.udpServer
  , connection = macros.connection
  , count      = 0
  , finished   = false
  ;

//
// TOTAL is the number of iterations to do
// DESIRED is the minimum number of requests expected
// SAMPLE Number of samples to send, e.g. @0.1 (1 in 10)
//
var DESIRED = 90
  , TOTAL   = 1000
  , SAMPLE  = 0.1
  ;

//
// Try to do this a thousand times
// [1,2,3,...,1000]
//
var coll = [];
for(i=0; i<TOTAL; i++) {
  coll.push(i);
}

//
// Remove console.log from errors, plenty of nothing to send here
//
connection.on_error = function () {};

//
// We are going to do one thousand `TOTAL` packets
// and see if we hit our minimums
//
// When you specify sampling `lynx` must track that it only send the amount
// of packages you are specifying (e.g. 1 in each 10 for @0.1 as in `SAMPLE`)
//
// To do this we use random numbers, making our process not perfect but
// accurate enough
//
// Because of the randomness that is used to select which packets are sent
// this can never be an exact test and might break while the code is
// perfectly fine
//
test('sampling', function (t) {
  var server = udpServer(function (message, remote) {
    count++;

    //
    // Add, check if its a valid statsd message and includes sample rate
    // that is teh same as being tested
    //
    var match = statsd.matchStatsd(message.toString());
    t.ok(match, message.toString());
    t.equal(SAMPLE.toString(), match.sample_rate);

    //
    // When we finally hit our lower threshold
    //
    if(count > DESIRED) {
      finished = true;
      t.ok(true, 'Reached ' + DESIRED + ' on ' + (TOTAL - coll.length) + 
        ' packets.');
      server.close();
    }
  });

  //
  // Run all the iterations
  //
  var runAll = function(coll, callback) {
    (function iterate() {
      if (coll.length === 0) {
        return callback();
      }
      coll.pop();
      setTimeout(function send_packet() {
        //
        // Send a sample
        //
        connection.gauge('spl.foo', 500, SAMPLE);
        process.nextTick(iterate);
      }, Math.ceil(Math.random() * 10));
    })();
  };

  runAll(coll, function() {
    if (finished) {
      t.ok(true, 'Reached ' + DESIRED + ' on ' + TOTAL + ' packets.');
      t.end();
      return;
    }
    //
    // If we reached the end and this has not closed by having
    // the desired amount of requests
    //
    t.ok(false, 'Didnt reach the desired amount of packets ' + DESIRED +
      '/' + TOTAL + ' was -> ' + count);
    server.close();
    t.end();
  });
});

//
// TODO: Sampling with irregular batches
//