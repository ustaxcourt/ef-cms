const client = require('../../dynamodbClientService');
const { aggregateCaseItems } = require('../helpers/aggregateCaseItems');

/**
 * getCaseByCaseId
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the case id to get
 * @returns {object} the case details
 */
exports.getCaseByCaseId = async ({ applicationContext, caseId }) => {
  const caseItems = await client.query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
    },
    ExpressionAttributeValues: {
      ':pk': `case|${caseId}`,
    },
    KeyConditionExpression: '#pk = :pk',
    applicationContext,
  });

  if (!caseItems) {
    return null;
  }

  return aggregateCaseItems(caseItems);
};
