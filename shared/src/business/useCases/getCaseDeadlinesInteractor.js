const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { CaseDeadline } = require('../entities/CaseDeadline');
const { pick } = require('lodash');
const { UnauthorizedError } = require('../../errors/errors');

/**
 * getCaseDeadlinesInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.endDate the end date
 * @param {string} providers.startDate the start date
 * @param {string} providers.from the index to start from
 * @param {string} providers.judge the judge
 * @param {number} providers.pageSize the page size
 * @returns {Promise} the promise of the getCaseDeadlinesByDateRange call
 */
exports.getCaseDeadlinesInteractor = async ({
  applicationContext,
  endDate,
  from,
  judge,
  pageSize,
  startDate,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.CASE_DEADLINE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const {
    foundDeadlines,
    totalCount,
  } = await applicationContext
    .getPersistenceGateway()
    .getCaseDeadlinesByDateRange({
      applicationContext,
      endDate,
      from,
      judge,
      pageSize,
      startDate,
    });

  const validatedCaseDeadlines = CaseDeadline.validateRawCollection(
    foundDeadlines,
    {
      applicationContext,
    },
  );

  // get the needed cases info data for caseDeadlines
  const docketNumbers = Object.keys(
    validatedCaseDeadlines.reduce((acc, item) => {
      acc[item.docketNumber] = true;
      return acc;
    }, {}),
  );

  const allCaseData = await applicationContext
    .getPersistenceGateway()
    .getCasesByDocketNumbers({
      applicationContext,
      docketNumbers,
    });

  const validatedCaseData = Case.validateRawCollection(allCaseData, {
    applicationContext,
  });

  const caseMap = validatedCaseData.reduce((acc, item) => {
    acc[item.docketNumber] = item;
    return acc;
  }, {});

  const afterCaseMapping = validatedCaseDeadlines.map(deadline => ({
    ...deadline,
    ...pick(caseMap[deadline.docketNumber], [
      'caseCaption',
      'docketNumber',
      'docketNumberSuffix',
    ]),
  }));

  return { deadlines: afterCaseMapping, totalCount };
};
