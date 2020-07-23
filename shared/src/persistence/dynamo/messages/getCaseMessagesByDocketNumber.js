const {
  getCaseIdFromDocketNumber,
} = require('../cases/getCaseIdFromDocketNumber');
const { query } = require('../../dynamodbClientService');

/**
 * getCaseMessagesByDocketNumber
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case
 * @returns {object} the created case message
 */
exports.getCaseMessagesByDocketNumber = async ({
  applicationContext,
  docketNumber,
}) => {
  const caseId = await getCaseIdFromDocketNumber({
    applicationContext,
    docketNumber,
  });

  return await query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':pk': `case|${caseId}`,
      ':prefix': 'message|',
    },
    KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
    applicationContext,
  });
};
