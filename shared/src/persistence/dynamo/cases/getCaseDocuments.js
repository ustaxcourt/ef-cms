const { query } = require('../../dynamodbClientService');

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

  if (!documents.length) {
    console.log('no documents found for ' + theCase.caseId);
  }

  return {
    ...theCase,
    documents,
  };
};
