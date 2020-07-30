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
 * @param {string} providers.docketNumber the docket number of the case to update case note
 * @param {string} providers.caseNote the note to update
 * @returns {object} the updated case note returned from persistence
 */
exports.saveCaseNoteInteractor = async ({
  applicationContext,
  caseNote,
  docketNumber,
}) => {
  const user = applicationContext.getCurrentUser();
  if (!isAuthorized(user, ROLE_PERMISSIONS.CASE_NOTES)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
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

  return new Case(result, { applicationContext }).validate().toRawObject();
};
