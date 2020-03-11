const { query } = require('../../dynamodbClientService');
const { sortBy } = require('lodash');

/**
 * getCaseDocketRecord
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {Function} async function to be used in an array.map
 */
exports.getCaseDocketRecord = ({ applicationContext }) => async theCase => {
  const docketRecord = await query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':pk': `case|${theCase.caseId}`,
      ':prefix': 'docket-record',
    },
    KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
    applicationContext,
  });

  const sortedDocketRecord = sortBy(docketRecord, 'index');

  return {
    ...theCase,
    docketRecord: sortedDocketRecord,
  };
};
