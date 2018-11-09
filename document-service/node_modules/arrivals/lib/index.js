'use strict';

var EventEmitter = require('events').EventEmitter;
var util = require('util');
var Nanotimer = require('nanotimer');
var debug = require('debug')('arrivals');

module.exports = {
  uniform: {
    process: createUniform
  },
  poisson: {
    process: createPoisson
  }
};

function createUniform(tickInterval, duration) {
  var up = new UniformProcess(tickInterval, duration);
  return up;
}

function createPoisson(mean, duration) {
  return new PoissonProcess(mean, duration);
}

function UniformProcess(tickInterval, duration) {
  debug(`tickInterval = ${tickInterval}, duration = ${duration}`);
  this._tickInterval = Math.floor(tickInterval * 1000); // microseconds
  debug(`this._tickInterval set to ${this._tickInterval}`);
  this._interval = null;
  this._duration = duration * 1000 || null; // microseconds
  this._timer = new Nanotimer();
  return this;
}

util.inherits(UniformProcess, EventEmitter);

UniformProcess.prototype.start = function() {
  var self = this;
  var arrivals = 0;
  var maxArrivals = Infinity;
  if (self._duration) {
    maxArrivals = Math.floor(self._duration / self._tickInterval);
  }
  debug(`maxArrivals = ${maxArrivals}`);
  self._interval = self._timer.setInterval(function() {
    self.emit('arrival');
    arrivals++;
    if (arrivals === maxArrivals) {
      debug(`maxArrivals reached, stopping`);
      self.stop();
    }
  }, '', self._tickInterval + 'u');
  return self;
};

UniformProcess.prototype.stop = function() {
  this._timer.clearInterval();
  this.emit('finished');
  return this;
};

function PoissonProcess(mean, duration) {
  this._mean = mean;
  this._timeout = null;
  this._duration = duration * 1e6 || null; // ns
  this._elapsed = null;
  this._timer = new Nanotimer();
  return this;
}

util.inherits(PoissonProcess, EventEmitter);

PoissonProcess.prototype.start = function() {
  var dt = sample(this._mean);
  var started = process.hrtime();
  var self = this;
  self._timeout = self._timer.setTimeout(function() {
    var ended = process.hrtime(started);
    self._elapsed += (ended[0] * 1e9) + ended[1];
    if (self._duration && (self._elapsed >= self._duration)) {
      // done, nothing to clear
      self.emit('finished');
    } else {
      self.start();
      self.emit('arrival');
    }
  }, '', dt + 'm');
};

PoissonProcess.prototype.stop = function() {
  this._timer.clearTimeout(this._timeout);
  this.emit('finished');
};

function sample(l) {
  // http://wwwhome.math.utwente.nl/~scheinhardtwrw/ISP2013/sheets9.pdf
  return -Math.log(Math.random()) * l;
}
