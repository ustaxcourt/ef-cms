'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_CLEAR_TIMEOUT = exports.DEFAULT_SET_TIMEOUT = exports.DEFAULT_NOW_FN = exports.DEFAULT_AGGRESSION = exports.DEFAULT_THRESHOLD_MS = undefined;
exports.setDriftless = setDriftless;
exports.clearDriftless = clearDriftless;
exports.setDriftlessTimeout = setDriftlessTimeout;
exports.setDriftlessInterval = setDriftlessInterval;

var _present = require('present');

var _present2 = _interopRequireDefault(_present);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var DEFAULT_THRESHOLD_MS = exports.DEFAULT_THRESHOLD_MS = 1;
var DEFAULT_AGGRESSION = exports.DEFAULT_AGGRESSION = 1.1;
var DEFAULT_NOW_FN = exports.DEFAULT_NOW_FN = function DEFAULT_NOW_FN() {
  return _present2.default.apply(undefined, arguments);
};
var DEFAULT_SET_TIMEOUT = exports.DEFAULT_SET_TIMEOUT = function DEFAULT_SET_TIMEOUT() {
  return setTimeout.apply(undefined, arguments);
};
var DEFAULT_CLEAR_TIMEOUT = exports.DEFAULT_CLEAR_TIMEOUT = function DEFAULT_CLEAR_TIMEOUT() {
  return clearTimeout.apply(undefined, arguments);
};

var timerHandles = {};
var nextId = 0;

function tryDriftless(id, opts) {
  var _this = this,
      _arguments = arguments;

  var atMs = opts.atMs,
      fn = opts.fn,
      _opts$thresholdMs = opts.thresholdMs,
      thresholdMs = _opts$thresholdMs === undefined ? DEFAULT_THRESHOLD_MS : _opts$thresholdMs,
      _opts$aggression = opts.aggression,
      aggression = _opts$aggression === undefined ? DEFAULT_AGGRESSION : _opts$aggression,
      _opts$customNow = opts.customNow,
      customNow = _opts$customNow === undefined ? DEFAULT_NOW_FN : _opts$customNow,
      _opts$customSetTimeou = opts.customSetTimeout,
      customSetTimeout = _opts$customSetTimeou === undefined ? DEFAULT_SET_TIMEOUT : _opts$customSetTimeou;

  var delayMs = atMs - customNow();

  var handle = delayMs > thresholdMs ? customSetTimeout(function () {
    tryDriftless.apply(_this, _arguments); // eslint-disable-line prefer-rest-params
  }, delayMs / aggression) : customSetTimeout(function () {
    // Call the function using setTimeout to ensure asynchrony
    fn();
  }, 0);

  timerHandles[id] = handle;
}

function setDriftless() {
  return setDriftless.setDriftlessSpyable.apply(setDriftless, arguments);
}

// Separate function for testing
setDriftless.setDriftlessSpyable = function (opts) {
  var id = nextId;
  nextId += 1;
  tryDriftless(id, opts);
  return id;
};

function clearDriftless(id) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _opts$customClearTime = opts.customClearTimeout,
      customClearTimeout = _opts$customClearTime === undefined ? DEFAULT_CLEAR_TIMEOUT : _opts$customClearTime;

  customClearTimeout(timerHandles[id]);
}

function castToFn(fn) {
  return typeof fn === 'function' ? fn : new Function(fn); // eslint-disable-line no-new-func
}

function setDriftlessTimeout(fn, delayMs) {
  for (var _len = arguments.length, params = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    params[_key - 2] = arguments[_key];
  }

  var callFn = castToFn(fn);
  return setDriftless({
    atMs: DEFAULT_NOW_FN() + delayMs,
    fn: function fn() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return callFn.call.apply(callFn, [this].concat(_toConsumableArray(args), params));
    }
  });
}

function setDriftlessInterval(fn, delayMs) {
  for (var _len3 = arguments.length, params = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
    params[_key3 - 2] = arguments[_key3];
  }

  var callFn = castToFn(fn);
  var id = void 0;
  var opts = {
    atMs: DEFAULT_NOW_FN() + delayMs,
    fn: function fn() {
      opts.atMs += delayMs;
      tryDriftless(id, opts);

      for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      return callFn.call.apply(callFn, [this].concat(_toConsumableArray(args), params));
    }
  };
  id = setDriftless(opts);
  return id;
}