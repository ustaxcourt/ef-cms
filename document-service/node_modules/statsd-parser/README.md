# statsd-parser

a streaming parser for the statsd protocol

# installation

## node.js

1. install [npm]
2. `npm install statsd-parser`
3. `var statsd_parser = require('statsd-parser');`

# usage

## basics

``` js
var statsd_parser = require("statsd-parser")
  , parser = statsd_parser.parser()
  ;

parser.onerror = function (e) {
  // an error happened. e is the error
};

parser.onstat = function (txt, obj) {
  // got some value
};
parser.onend = function () {
  // parser stream is done, and ready to have more stuff written to it.
};

parser.write('foo.bar:1|c').close();
```

``` js
//
// stream usage
// takes the same options as the parser
//
var stream = require("statsd-parser").createStream(options);

stream.on("error", function (e) {
  // unhandled errors will throw, since this is a proper node
  // event emitter.
  console.error("error!", e);
  // clear the error
  this._parser.error = null;
  this._parser.resume();
})

stream.on("stat", function (txt, obj) {
  // same object as above
});
//
// pipe is supported, and it's readable/writable
// same chunks coming in also go out
//
fs.createReadStream("file.statsd")
  .pipe(stream)
  .pipe(fs.createReadStream("file-fixed.statsd"))
```

you also have two helper functions to see if a string is a statsd stat `isStatsd` and one to check extract values from a statsd string (or null if it's not statsd)

``` js
> var statsd = require('statsd-parser');
> statsd.isStatsd('a:1|c|@0.1')
true
> statsd.matchStatsd('a:1|c|@0.1')
{ stat: 'a',
  value: '1',
  type: 'c',
  sample_rate: '0.1' }
> statsd.matchStatsd('b:200|s')
{ stat: 'b',
  value: '200',
  type: 's' }
> statsd.matchStatsd('b:200|s@INVALID')
null
```

# contribute

everyone is welcome to contribute. patches, bug-fixes, new features

1. create an [issue][issues] so the community can comment on your idea
2. fork `statsd-parser`
3. create a new branch `git checkout -b my_branch`
4. create tests for the changes you made
5. make sure you pass both existing and newly inserted tests
6. commit your changes
7. push to your branch `git push origin my_branch`
8. create an pull request

# meta

* code: `git clone git://github.com/dscape/statsd-parser.git`
* home: <http://github.com/dscape/statsd-parser>
* bugs: <http://github.com/dscape/statsd-parser/issues>

`(oO)--',-` in [caos]

[npm]: http://npmjs.org
[issues]: http://github.com/dscape/statsd-parser/issues
[caos]: http://caos.di.uminho.pt/