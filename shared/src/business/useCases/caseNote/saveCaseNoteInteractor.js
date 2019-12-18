const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * saveCaseNoteInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to update case note
 * @param {string} providers.caseNote the note to update
 * @returns {object} the updated case note returned from persistence
 */
exports.saveCaseNoteInteractor = async ({
  applicationContext,
  caseId,
  caseNote,
}) => {
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

  const caseToUpdate = new Case(
    { ...caseRecord, caseNote },
    {
      applicationContext,
    },
  )
    .validate()
    .toRawObject();

  const result = await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate,
  });

  return result;
};
