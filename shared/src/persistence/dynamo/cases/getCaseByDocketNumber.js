const client = require('../../dynamodbClientService');
const { getCaseByCaseId } = require('../../dynamo/cases/getCaseByCaseId');

/**
 * getCaseByDocketNumber
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number to get
 * @returns {object} the case details
 */
exports.getCaseByDocketNumber = async ({
  applicationContext,
  docketNumber,
}) => {
  const [firstEntry] = await client.query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
    },
    ExpressionAttributeValues: {
      ':pk': `case-by-docket-number|${docketNumber}`,
    },
    KeyConditionExpression: '#pk = :pk',
    applicationContext,
  });

  const [, caseId] = firstEntry.sk.split('|');

  const fullCase = await getCaseByCaseId({
    applicationContext,
    caseId,
  });

  return fullCase;
};
