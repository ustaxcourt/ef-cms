const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { CaseDeadline } = require('../../entities/CaseDeadline');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * updateCaseDeadlineInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseDeadline the case deadline data
 * @returns {object} the updated case deadline
 */
exports.updateCaseDeadlineInteractor = async ({
  applicationContext,
  caseDeadline,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.CASE_DEADLINE)) {
    throw new UnauthorizedError('Unauthorized for updating case deadline');
  }

  let caseDeadlineToUpdate = new CaseDeadline(caseDeadline, {
    applicationContext,
  });
  caseDeadlineToUpdate = caseDeadlineToUpdate.validate().toRawObject();

  await applicationContext.getPersistenceGateway().updateCaseDeadline({
    applicationContext,
    caseDeadlineToUpdate,
  });

  return caseDeadlineToUpdate;
};
