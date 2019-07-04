const {
  CASE_DEADLINE,
  isAuthorized,
} = require('../../../authorization/authorizationClientService');
const { CaseDeadline } = require('../../entities/CaseDeadline');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * createCaseDeadlineInteractor
 *
 * @param applicationContext
 * @param caseDeadline
 * @returns {*}
 */
exports.createCaseDeadlineInteractor = async ({
  applicationContext,
  caseDeadline,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, CASE_DEADLINE)) {
    throw new UnauthorizedError('Unauthorized for create case deadline');
  }

  const newCaseDeadline = new CaseDeadline(caseDeadline);

  await applicationContext.getPersistenceGateway().createCaseDeadline({
    applicationContext,
    caseDeadline: newCaseDeadline.validate().toRawObject(),
  });

  return newCaseDeadline;
};
