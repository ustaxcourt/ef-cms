const { Case } = require('../entities/cases/Case');

/**
 * getCaseTypesInteractor
 *
 * @returns {Array<string>} case types
 */
exports.getCaseTypesInteractor = async () => {
  return Case.CASE_TYPES;
};
