const { CASE_STATUS_TYPES } = require('../entities/EntityConstants');
const { compareISODateStrings } = require('../utilities/sortFunctions');
const { UserCase } = require('../entities/UserCase');

/**
 * getClosedCasesInteractor
 *
 * @param {object} applicationContext the application context
 * @returns {object} the closed cases data
 */
exports.getClosedCasesInteractor = async applicationContext => {
  const { userId } = await applicationContext.getCurrentUser();

  const closedCases = await applicationContext
    .getPersistenceGateway()
    .getCasesForUser({
      applicationContext,
      userId,
    });

  const sortedClosedCases = closedCases
    .filter(({ status }) => status === CASE_STATUS_TYPES.closed)
    .sort((a, b) => compareISODateStrings(a.closedDate, b.closedDate))
    .reverse();

  return UserCase.validateRawCollection(sortedClosedCases, {
    applicationContext,
  });
};
