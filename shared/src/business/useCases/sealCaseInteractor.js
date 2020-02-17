const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { UnauthorizedError } = require('../../errors/errors');

/**
 * sealCaseInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to update
 * @returns {Promise<object>} the updated case data
 */
exports.sealCaseInteractor = async ({ applicationContext, caseId }) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.SEAL_CASE)) {
    throw new UnauthorizedError('Unauthorized for sealing cases');
  }

  const oldCase = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({ applicationContext, caseId });

  const newCase = new Case(oldCase, { applicationContext });

  newCase.setAsSealed();

  const updatedCase = await applicationContext
    .getPersistenceGateway()
    .updateCase({
      applicationContext,
      caseToUpdate: newCase.validate().toRawObject(),
    });

  return new Case(updatedCase, { applicationContext }).validate().toRawObject();
};
