const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * deleteCaseNoteInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case the procedural note is attached to
 * @returns {Promise} the promise of the delete call
 */
exports.deleteCaseNoteInteractor = async (
  applicationContext,
  { docketNumber },
) => {
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

  delete caseRecord.caseNote;

  const result = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: caseRecord,
    });

  return new Case(result, { applicationContext }).validate().toRawObject();
};
