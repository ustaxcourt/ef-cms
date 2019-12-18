const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * deleteCaseNoteInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case the procedural note is attached to
 * @returns {Promise} the promise of the delete call
 */
exports.deleteCaseNoteInteractor = async ({ applicationContext, caseId }) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.PROCEDURAL_NOTES)) {
    throw new UnauthorizedError('Unauthorized');
  }
  const caseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });

  delete caseRecord.proceduralNote;
  const caseToUpdate = new Case(caseRecord, {
    applicationContext,
  })
    .validate()
    .toRawObject();

  const result = await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate,
  });
  return result;
};
