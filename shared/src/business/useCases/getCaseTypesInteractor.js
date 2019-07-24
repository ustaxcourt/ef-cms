const { Case } = require('../entities/cases/Case');

/**
 * getCaseTypesInteractor
 *
 * @param userId
 * @returns {Promise<*>}
 */
exports.getCaseTypesInteractor = async () => {
  return Case.CASE_TYPES;
};
