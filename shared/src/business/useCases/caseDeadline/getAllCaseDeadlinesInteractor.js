const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { CaseDeadline } = require('../../entities/CaseDeadline');
const { pick } = require('lodash');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * getAllCaseDeadlinesInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {Promise} the promise of the getCaseDeadlines call
 */
exports.getAllCaseDeadlinesInteractor = async ({ applicationContext }) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.CASE_DEADLINE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const allCaseDeadlines = await applicationContext
    .getPersistenceGateway()
    .getAllCaseDeadlines({
      applicationContext,
    });

  const validatedCaseDeadlines = CaseDeadline.validateRawCollection(
    allCaseDeadlines,
    {
      applicationContext,
    },
  );

  // get the needed cases info data for caseDeadlines
  const caseIds = Object.keys(
    validatedCaseDeadlines.reduce((acc, item) => {
      acc[item.caseId] = true;
      return acc;
    }, {}),
  );

  const allCaseData = await applicationContext
    .getPersistenceGateway()
    .getCasesByCaseIds({
      applicationContext,
      caseIds,
    });

  const caseMap = allCaseData.reduce((acc, item) => {
    acc[item.caseId] = item;
    return acc;
  }, {});

  const afterCaseMapping = validatedCaseDeadlines.map(m => ({
    ...m,
    ...pick(caseMap[m.caseId], [
      'associatedJudge',
      'caseCaption',
      'docketNumber',
      'docketNumberSuffix',
    ]),
  }));

  return afterCaseMapping;
};
