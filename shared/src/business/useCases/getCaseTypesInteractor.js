const { Case } = require('../entities/cases/Case');

/**
 * getCaseTypes
 *
 * @param userId
 * @returns {Promise<*>}
 */
exports.getCaseTypes = async () => {
  return Case.CASE_TYPES;
};
