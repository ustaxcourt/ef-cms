const client = require('../../dynamodbClientService');
const {
  CASE_STATUS_TYPES,
} = require('../../../business/entities/EntityConstants');

/**
 * getIndexedCasesForUser
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.statuses case status to filter by
 * @param {string} providers.userId the userId to filter cases by
 * @returns {object} the case data
 */
exports.getIndexedCasesForUser = async ({
  applicationContext,
  statuses,
  userId,
}) => {
  const caseItems = await client.queryFull({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':pk': `user|${userId}`,
      ':prefix': 'case',
    },
    KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
    applicationContext,
  });

  let filteredCaseItems = caseItems.filter(({ status }) => {
    return statuses.includes(status);
  });

  if (statuses.length === 1 && statuses[0] === CASE_STATUS_TYPES.closed) {
    filteredCaseItems = filteredCaseItems.sort((a, b) => {
      return new Date(b.closedDate) - new Date(a.closedDate);
    });
  }

  return filteredCaseItems;
};
