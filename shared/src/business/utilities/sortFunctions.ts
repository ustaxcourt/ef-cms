/**
 * compares date strings (in the most efficient manner)
 *
 * @param {string} a the first date string to compare
 * @param {string} b the second date string to compare
 * @returns {number} the result of the comparison
 */
export const compareISODateStrings = (a, b) => {
  return compareStrings(a, b);
};

/**
 * compares strings (in the most efficient manner)
 *
 * @param {string} a the first string to compare
 * @param {string} b the second string to compare
 * @returns {number} the result of the comparison
 */
export const compareStrings = (a, b) => {
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
