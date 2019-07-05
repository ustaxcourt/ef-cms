const {
  CASE_DEADLINE,
  isAuthorized,
} = require('../../../authorization/authorizationClientService');
const { CaseDeadline } = require('../../entities/CaseDeadline');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * updateCaseDeadlineInteractor
 *
 * @param applicationContext
 * @param updateCaseDeadline
 * @returns {*}
 */
exports.updateCaseDeadlineInteractor = async ({
  applicationContext,
  caseDeadline,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, CASE_DEADLINE)) {
    throw new UnauthorizedError('Unauthorized for updating case deadline');
  }

  let caseDeadlineToUpdate = new CaseDeadline(caseDeadline);
  caseDeadlineToUpdate = caseDeadline.validate().toRawObject();

  await applicationContext.getPersistenceGateway().updateCaseDeadline({
    applicationContext,
    caseDeadlineToUpdate,
  });

  return caseDeadlineToUpdate;
};
