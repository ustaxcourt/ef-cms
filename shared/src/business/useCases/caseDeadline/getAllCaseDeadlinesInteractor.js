const {
  CASE_DEADLINE,
  isAuthorized,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');
const { Case } = require('../../entities/cases/Case');

/**
 * getAllCaseDeadlinesInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {Promise} the promise of the getCaseDeadlines call
 */
exports.getAllCaseDeadlinesInteractor = async ({ applicationContext }) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, CASE_DEADLINE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const allCaseDeadlines = await applicationContext
    .getPersistenceGateway()
    .getAllCaseDeadlines({
      applicationContext,
    });

  return allCaseDeadlines.map(caseDeadline => ({
    ...caseDeadline,
    caseTitle: Case.getCaseCaptionNames(Case.getCaseCaption(caseDeadline)),
  }));
};
