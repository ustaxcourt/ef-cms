const client = require('../../dynamodbClientService');

/**
 * getCaseIdFromDocketNumber
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case to retrieve
 * @returns {Array<Promise>} the promises for the persistence delete calls
 */
exports.getCaseIdFromDocketNumber = async ({
  applicationContext,
  docketNumber,
}) => {
  const caseData = await client.query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
    },
    ExpressionAttributeValues: {
      ':pk': `case-by-docket-number|${docketNumber}`,
    },
    KeyConditionExpression: '#pk = :pk',
    applicationContext,
  });

  if (caseData.length === 0) {
    return null;
  }

  const [firstEntry] = caseData;

  const [, caseId] = firstEntry.sk.split('|');

  return caseId;
};
