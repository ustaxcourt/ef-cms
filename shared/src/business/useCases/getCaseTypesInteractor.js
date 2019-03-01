const Case = require('../entities/Case');

/**
 * getCaseTypes
 *
 * @param userId
 * @returns {Promise<*>}
 */
exports.getCaseTypes = async () => {
  return Case.getCaseTypes();
};
