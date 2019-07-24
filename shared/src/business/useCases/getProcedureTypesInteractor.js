const { Case } = require('../entities/cases/Case');

/**
 * getProcedureTypesInteractor
 *
 * @param userId
 * @returns {Promise<*>}
 */
exports.getProcedureTypesInteractor = async () => {
  return Case.PROCEDURE_TYPES;
};
