'use strict';

var assert = require('assert');
var sleep = require('./');


try {
  sleep('string');
  throw new Error('sleep with a string should throw an error');
} catch (ex) {
  assert(ex instanceof TypeError);
}
try {
  sleep(-10);
  throw new Error('sleep with a negative number should throw an error');
} catch (ex) {
  assert(ex instanceof RangeError);
}
try {
  sleep(1.5);
  throw new Error('sleep with a non-integer should throw an error');
} catch (ex) {
  assert(ex instanceof TypeError);
}
try {
  sleep(Math.pow(2, 64));
  throw new Error('sleep with a very large integer should throw an error');
} catch (ex) {
  assert(ex instanceof RangeError);
}

var start = Date.now();
var res = sleep(1000);
var end = Date.now();
console.log('Time as returned by sleep():', res);
console.log('Time counted on our own:    ', end - start);
assert(Math.abs(1000 - res) < 100);
assert(Math.abs(1000 - (end - start)) < 100);

console.log('tests passed');
