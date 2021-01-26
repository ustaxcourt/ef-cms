const { Case } = require('../../entities/cases/Case');

/**
 * updateCaseAndAssociations
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseToUpdate the case object which was updated
 * @returns {Promise<*>} the updated case entity
 */
exports.updateCaseAndAssociations = async ({
  applicationContext,
  caseToUpdate,
}) => {
  const caseEntity = caseToUpdate.validate
    ? caseToUpdate
    : new Case(caseToUpdate, { applicationContext });

  const validRawCaseEntity = caseEntity.validate().toRawObject();

  // TODO: hoist logic from persistence method below to this use case helper.

  return applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: validRawCaseEntity,
  });
};
