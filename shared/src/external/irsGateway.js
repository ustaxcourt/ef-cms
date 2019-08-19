const { createISODateString } = require('../utilities/DateHandler');

/**
 *
 * @returns {string} the current timestamp as a string
 */
exports.sendToIRS = async () => {
  // noop
  return createISODateString();
};
