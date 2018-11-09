# arrivals

`arrivals` models arrival events in a system, e.g.:

- visitors arriving to use a website
- incoming phone calls to an exchange
- ghosts spawning in Pacman

This library was originally developed for use in [Artillery](https://artillery.io/), a modern load testing toolkit.

## Usage

`npm install arrivals`

Two models of arrival processes are available: [Poisson](http://en.wikipedia.org/wiki/Poisson_process) and Uniform (arrivals at a specified constant rate).


```javascript
//
// Poisson process example
//
var arrivals = require('arrivals');

// Create a Poisson process with the mean inter-arrival time of 500 ms that
// will run for 20 seconds:
var p = arrivals.poisson.process(500, 20 * 1000);

p.on('arrival', function onArrival() {
  console.log('New arrival, %s', new Date());
});

p.once('finished', function() {
  console.log('We are done.');
});

p.start();
```

If the last argument (total duration of the process) is omitted, the process
will run until stopped with `p.stop()`.

```javascript
//
// Uniform arrivals example:
//
var arrivals = require('arrivals');

// Create an arrivals process that will trigger the callback every 500ms for
// 20 seconds (for a total of 20000 / 200 = 40 arrivals)
var p = arrivals.uniform.process(500, 20 * 1000);

p.on('arrival', function onArrival() {
  console.log('New arrival, %s', new Date());
}

p.once('finished', function() {
  console.log('We are done.');
});

p.start();
```

The last argument (total duration) is optional as in the previous example.

## License

This software is distributed under the terms of the [ISC](http://en.wikipedia.org/wiki/ISC_license) license.

```
Copyright (c) 2015-2017, Hassy Veldstra <h@artillery.io>

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
```
