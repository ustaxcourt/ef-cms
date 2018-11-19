'use strict';

var childProcess = require('child_process');
var nodeBin = process.argv[0];

module.exports = sleep;
function sleep(milliseconds) {
  var start = Date.now();
  if (milliseconds !== Math.floor(milliseconds)) {
    throw new TypeError('sleep only accepts an integer number of milliseconds');
  } else if (milliseconds < 0) {
    throw new RangeError('sleep only accepts a positive number of milliseconds');
  } else if (milliseconds !== (milliseconds | 0)) {
    throw new RangeError('sleep duration out of range')
  }
  milliseconds = milliseconds | 0;

  var shouldEnd = start + milliseconds;
  try {
    childProcess.execFileSync(nodeBin, [ '-e',
      'setTimeout(function() {}, ' + shouldEnd + ' - Date.now());'
    ], {
      timeout: milliseconds,
    });
  } catch (ex) {
    if (ex.code !== 'ETIMEDOUT') {
      throw ex;
    }
  }
  var end = Date.now();
  return end - start;
}
