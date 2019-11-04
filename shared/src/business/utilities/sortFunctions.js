/**
 * sets the service indicators for parties on the given case
 *
 * @param {string} a the first date string to compare
 * @param {string} b the second date string to compare
 * @returns {number} the result of the comparison
 */
const compareDateStrings = (a, b) => {
  let result;
  if (a < b) {
    result = -1;
  } else if (a > b) {
    result = 1;
  } else {
    result = 0;
  }
  return result;
};

module.exports = {
  compareDateStrings,
};
