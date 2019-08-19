const { createISODateString } = require('../business/utilities/DateHandler');

/**
 *
 * @returns {string} the current timestamp as a string
 */
exports.sendToIRS = async () => {
  // noop
  return createISODateString();
};
