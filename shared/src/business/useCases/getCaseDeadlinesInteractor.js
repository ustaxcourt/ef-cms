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
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.endDate the end date
 * @param {string} providers.startDate the start date
 * @param {string} providers.from the index to start from
 * @param {string} providers.judge the judge
 * @param {number} providers.pageSize the page size
 * @returns {Promise} the promise of the getCaseDeadlinesByDateRange call
 */
exports.getCaseDeadlinesInteractor = async (
  applicationContext,
  { endDate, from, judge, pageSize, startDate },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.CASE_DEADLINE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { foundDeadlines, totalCount } = await applicationContext
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

  const caseMap = await getCasesByDocketNumbers({
    applicationContext,
    docketNumbers: validatedCaseDeadlines.map(item => item.docketNumber),
  });

  const afterCaseMapping = validatedCaseDeadlines
    .filter(deadline => caseMap[deadline.docketNumber])
    .map(deadline => ({
      ...deadline,
      ...pick(caseMap[deadline.docketNumber], [
        'caseCaption',
        'docketNumber',
        'docketNumberSuffix',
        'docketNumberWithSuffix',
      ]),
    }));

  return { deadlines: afterCaseMapping, totalCount };
};

/**
 * Helper function to grab all of the cases from persistence; only return the valid cases
 *
 * @param {object} providers The providers
 * @param {object} providers.applicationContext the application context
 * @param {array}  providers.docketNumbers an array of docket numbers to retrieve from persistence
 * @returns {array} a validated array of cases
 */
const getCasesByDocketNumbers = async ({
  applicationContext,
  docketNumbers,
}) => {
  const caseData = await applicationContext
    .getPersistenceGateway()
    .getCasesByDocketNumbers({
      applicationContext,
      docketNumbers,
    });

  return caseData
    .map(caseRecord => new Case(caseRecord, { applicationContext }))
    .filter(caseEntity => {
      try {
        caseEntity.validate();
        return true;
      } catch (err) {
        applicationContext.logger.error(
          `getCasesByDocketNumber: case ${caseEntity.docketNumber} failed validation`,
          {
            message: caseEntity.getFormattedValidationErrors(),
          },
        );
        return false;
      }
    })
    .reduce((acc, item) => {
      acc[item.docketNumber] = item;
      return acc;
    }, {});
};
