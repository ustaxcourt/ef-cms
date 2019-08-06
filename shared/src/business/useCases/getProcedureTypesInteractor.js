const { Case } = require('../entities/cases/Case');

/**
 * getProcedureTypesInteractor
 *
 * @returns {Array<string>} the procedure typess
 */
exports.getProcedureTypesInteractor = async () => {
  return Case.PROCEDURE_TYPES;
};
