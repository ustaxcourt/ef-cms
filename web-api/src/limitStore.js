/* eslint-disable promise/no-callback-in-promise */
const applicationContext = require('./applicationContext');

/**
 * @returns {Number} the date in which we can call reset of the limit window
 */
function calculateNextResetTime(windowMs) {
  // eslint-disable-next-line @miovision/disallow-date/no-new-date
  const d = new Date();
  d.setMilliseconds(d.getMilliseconds() + windowMs);
  return d;
}

/**
 * Creates a limit store in which all requests are treated equally
 * and placed into a single bucket, without distinction of IP address
 * or request path
 */
function LimitStore({ key, windowMs }) {
  this.key = key;
  let resetTime = calculateNextResetTime(windowMs);

  this.incr = function (_, cb) {
    applicationContext
      .getPersistenceGateway()
      .incrementKeyCount({ applicationContext, key: this.key })
      .then(count => {
        cb(null, count, resetTime);
      })
      .catch(cb);
  };

  this.decrement = function () {
    applicationContext
      .getPersistenceGateway()
      .decrementKeyCount({ applicationContext, key: this.key });
  };

  this.resetAll = function () {
    console.log('RESET ALL');
    applicationContext
      .getPersistenceGateway()
      .deleteKeyCount({ applicationContext, key: this.key });
    resetTime = calculateNextResetTime(windowMs);
  };

  this.resetKey = function (resetKey) {
    console.log('RESET KEY', resetKey);
  };

  // simply reset ALL hits every windowMs
  const interval = setInterval(this.resetAll, windowMs);
  if (interval.unref) {
    interval.unref();
  }
}

module.exports = LimitStore;
