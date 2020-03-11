const { query } = require('../../dynamodbClientService');
const { sortBy } = require('lodash');

/**
 * getCaseDocuments
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {Function} async function to be used in an array.map
 */
exports.getCaseDocuments = ({ applicationContext }) => async theCase => {
  const documents = await query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':pk': `case|${theCase.caseId}`,
      ':prefix': 'document',
    },
    KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
    applicationContext,
  });

  const sortedDocuments = sortBy(documents, 'createdAt');

  return {
    ...theCase,
    documents: sortedDocuments,
  };
};
