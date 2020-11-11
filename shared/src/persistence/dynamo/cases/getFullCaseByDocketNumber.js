const client = require('../../dynamodbClientService');
const { aggregateCaseItems } = require('../helpers/aggregateCaseItems');

/**
 * getFullCaseByDocketNumber
 * gets the full case when contents are over 400 kb
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number to get
 * @returns {object} the case details
 */
exports.getFullCaseByDocketNumber = async ({
  applicationContext,
  docketNumber,
}) => {
  const caseItems = await client.queryFull({
    ExpressionAttributeNames: {
      '#pk': 'pk',
    },
    ExpressionAttributeValues: {
      ':pk': `case|${docketNumber}`,
    },
    KeyConditionExpression: '#pk = :pk',
    applicationContext,
  });

  if (!caseItems) {
    return null;
  }

  return aggregateCaseItems(caseItems);
};
