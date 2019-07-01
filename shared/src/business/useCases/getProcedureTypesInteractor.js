const { Case } = require('../entities/cases/Case');

/**
 * getProcedureTypes
 *
 * @param userId
 * @returns {Promise<*>}
 */
exports.getProcedureTypes = async () => {
  return Case.PROCEDURE_TYPES;
};
