[![Build Status](https://travis-ci.org/vandium-io/lambda-leak.svg?branch=master)](https://travis-ci.org/vandium-io/lambda-leak)

# lambda-leak

Simple utility to detect resource leaks in [AWS Lambda](https://aws.amazon.com/lambda/details) handlers using [Node.js](https://nodejs.org) that
can lead to expensive charges lengthy operations or failures from timeouts.

## Features
* Detects socket leaks
* Detects excess timers
* Works with mocha's timeout system
* Works with Node 6.10.x

## Installation
Install via npm.

	npm install lambda-leak


## Getting Started

The `lambda-leak` detector should be used within a unit testing environment, like `mocha`, to capture and diagnose potential resource leaks. The
following example demonstrates how to use the leak detector inside a unit test.

```js
'use strict';

const lambdaLeak = require( 'lambda-leak' );

const handler = require( 'my-lambda-handler-module' );

describe( 'myModule', function() {

    describe( 'handler', function() {

        it( 'detect leak in my handler', function( done ) {

            const state = lambdaLeak.capture();

            handler( {/* event*/, { /* context */}, function( err, result ) {

                if( err ) {

                    return done( err );
                }

                let difference = state..getDifferenceInHandles();

                if( difference.length > 0 ) {

                    console.log( 'leaks', difference );

                    // leaks detected
                    done( new Error( 'leaks detected' ) );
                }

                done();
            });
        });
    });
});
```

## Projects Using `lambda-leak`

* [`lambda-tester`](https://github.com/vandium-io/lambda-tester) - reduce the time and effort to test AWS Lambda handlers.


## Feedback

We'd love to get feedback on how you're using lambda-tester and things we could add to make this tool better. Feel free to contact us at `feedback@vandium.io`

## License

[BSD-3-Clause](https://en.wikipedia.org/wiki/BSD_licenses)
