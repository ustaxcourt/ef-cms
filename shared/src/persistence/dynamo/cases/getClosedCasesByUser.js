const { Case } = require('../../../business/entities/cases/Case');
const { getUserCases } = require('./getUserCases');

/**
 * getClosedCasesByUser
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.userId the user id to get closed cases by
 * @returns {object} the closed cases
 */
exports.getClosedCasesByUser = async ({ applicationContext, userId }) => {
  const userCases = await getUserCases({ applicationContext, userId });

  const closedCases = userCases.filter(
    x => x.status === Case.STATUS_TYPES.closed,
  );

  return closedCases;
};
