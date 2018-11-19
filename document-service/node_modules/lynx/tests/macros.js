var path   = require('path')
  , dgram  = require('dgram')
  , test   = require('tap').test
  , lynx   = require('../lib/lynx')
  , macros = exports
  ;

//
// Percentage allowed for errors in aproximations
// Like, duration is around 100ms. Means for 10% error can be 10ms.
//
var MAX_APROX_ERROR = process.env.MAX_APROX_ERROR
                    ? parseInt(MAX_APROX_ERROR, 10)
                    : 10
                    ;

//
// Set the server port
//
macros.udpServerPort = 9753;

//
// Create a connection
//
macros.connection = new lynx('localhost', macros.udpServerPort);

//
// ### function udpServer(testName, onTest)
// #### @onMessage {Function} Function to be run on each message
//
// Start a `udp` server.
//
macros.udpServer = function udpServer(onMessage) {
  var socket = dgram.createSocket('udp4', onMessage);

  //
  // Listen in some (not so) random port
  //
  socket.bind(macros.udpServerPort, 'localhost');

  return socket;
};

//
// ### function udpFixturesServer(testName, onTest)
// #### @testName {String} The test that is calling this, so we can load
//      the respective fixture
// #### @onTest   {Function} Function that returns the result of a specific
//      test
//
// Start a `udp` server that will expect an event that is
// mocked in `fixtures`
//
macros.udpFixturesServer = function udpServer(testName, t, onTest) {
  //
  // Set the path for the fixture we want to load
  //
  var fixturePath = path.join('fixtures', testName + '.json');

  //
  // Try to load the fixture.
  // This will break your program if you delete by mistake
  //
  var fixture = require('./' + fixturePath);

  //
  // The number of requests we expect to get
  //
  var nrRequests = fixture.length
    , iRequests  = 0
    ;

  //
  // Create a UDP Socket
  //
  var socket = macros.udpServer(function (message, remote) {
    //
    // We got another one
    //
    iRequests++;

    //
    // `remote.address` for remote address
    // `remote.port` for remote port
    // `remote.size` for data lenght
    // `message.toString('ascii', 0, remote.size)` for textual contents
    //
    var actual    = macros.parseMessage(message, remote.size)
      , iExpected = fixture.indexOf(actual)
      ;

    //
    // Let's check if its an aproximation
    //
    if(!~iExpected) {
      //
      // In aproximations we note them as `foo:~10|s`
      // Lets see if we have any with the right key that is an aproximation
      //
      var aprox_fixtures_with_right_stat = fixture.filter(function (expctd) {
        var stat    = expctd.split(':')[0] // expected stat key
          , aStat   = actual.split(':')[0] // actual stat key
          , isAprox = ~expctd.indexOf('~') // is expected an aproximation?
          ;

        return stat === aStat && isAprox;
      });

      var aprox_actual = aprox_fixtures_with_right_stat[0];
      iExpected        = fixture.indexOf(aprox_actual);
    }

    //
    // Found it
    //
    if (~iExpected) {
      var expected = fixture[iExpected];

      //
      // Remove the found item from fixture to test
      //
      fixture.splice(iExpected, 1);

      //
      // Return our test results
      //
      onTest(true, {expected: expected, actual: actual, remaining: fixture});
    }
    //
    // We didn't find that response in the response array
    //
    else {
      onTest(false, { expected: null, actual: actual, remaining: fixture});
    }

    //
    // If we are done
    //
    if(iRequests === nrRequests) {
      //
      // Close the server
      //
      socket.close();

      //
      // Tests are complete
      //
      t.end();
    }
  });
};

//
// ### function matchFixturesTest(testName, onTest)
// #### @resource {String} The resource we are testing (gauges, sets, counts)
// #### @f        {Function} The actual udp client calls to be received by
//      our mock server
//
// 1.   Loads fixtures for this resource and checks how many client requests
//      are going to exist
// 2.   Runs a tests that:
// 2.1. Start a `udp` server that will expect a event that
//      is mocked in `fixtures`
// 2.2. Runs client code that should match what has been mocked
//
macros.matchFixturesTest = function genericTest(resource, f) {
  var currentFixture = require('./fixtures/' + resource);

  //
  // All of our counting tests
  //
  test(resource + ' test', function (t) {
    //
    // Setup our server
    //
    macros.udpFixturesServer(resource, t, function onEachRequest(err, info) {

      //
      // Aproximation
      //
      if(info.expected && ~info.expected.indexOf('~')) {
        //
        // foobar : ~ 10     |ms
        // /(.*)? : ~ (.*)? \|ms/
        //
        // ? means non eager, like don't eat multiple `:`.
        //
        var matchE = /(.*)?:~(.*)?\|ms/.exec(info.expected)
            //
            // Actual doesnt have `~`
            //
          , matchA = /(.*)?:(.*)?\|ms/.exec(info.actual)
          ;
        
        //
        // If we were able to extract values from both
        //
        if(matchE && typeof matchE[2] === 'string' &&
           matchA && typeof matchA[2] === 'string') {
          //
          // Get our aproximate number
          //
          var aproximation = parseInt(matchE[2], 10)
            , valueA       = parseInt(matchA[2], 10)
            ;

          //
          // Our upper bound
          //
          var ubound = aproximation + (aproximation * MAX_APROX_ERROR / 100);

          t.ok(ubound >= valueA, 'value deviated from ' + aproximation +
           ' by more than +' + MAX_APROX_ERROR + '%. [' + valueA + ']');

          //
          // Our lower bound
          //
          var lbound = aproximation - (aproximation * MAX_APROX_ERROR / 100);

          t.ok(lbound <= valueA, 'value deviated from ' + aproximation +
            ' by more than -' + MAX_APROX_ERROR + '%. [' + valueA + ']');
        }
        else {
          //
          // Show the expected vs actual string
          //
          t.equal(info.expected, info.actual,
            'Equality check for ' + info.actual);
        }
      }
      //
      // On each response check if they are identical
      //
      else {
        //
        // Just treat it like any other thing.
        // but hey, that fixture is wrong dude!
        //
        if(typeof info.expected === 'string') {
          t.equal(info.expected, info.actual, 
            'Equality check for ' + info.actual);
        }
        //
        // This failed, let's show the array of possibilities that could
        // have matched
        //
        else {
          t.equal(info.remaining, [info.actual],
            "Didn't find value " + info.actual + 
            ' in array of possible fixtures');
        }
      }
    });

    //
    // Run our client code
    //
    if(resource === 'scopes') {
      macros.connection.close();
      macros.connection = new lynx('localhost', macros.udpServerPort, {
        scope: 'scope' });
    }
    f(macros.connection);
  });
};

//
// ### function parseMessage(testName, onTest)
// #### @message {String} Message to decode
//
// Start a `udp` server.
//
macros.parseMessage = function parseMessage(message, size) {
  return message.toString('ascii', 0, size);
};

//
// Export simple `tap` tests
//
macros.test = test;

//
// Export `lynx`
//
macros.lynx = lynx;

//
// Export MAX_APROX_ERROR
//
macros.MAX_APROX_ERROR = MAX_APROX_ERROR;