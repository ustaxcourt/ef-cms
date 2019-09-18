const {
  CASE_DEADLINE,
  isAuthorized,
} = require('../../../authorization/authorizationClientService');
const { CaseDeadline } = require('../../entities/CaseDeadline');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * createCaseDeadlineInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseDeadline the case deadline data
 * @returns {CaseDeadline} the created case deadline
 */
exports.createCaseDeadlineInteractor = async ({
  applicationContext,
  caseDeadline,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, CASE_DEADLINE)) {
    throw new UnauthorizedError('Unauthorized for create case deadline');
  }

  const newCaseDeadline = new CaseDeadline(caseDeadline, {
    applicationContext,
  });

  await applicationContext.getPersistenceGateway().createCaseDeadline({
    applicationContext,
    caseDeadline: newCaseDeadline.validate().toRawObject(),
  });

  return newCaseDeadline;
};
