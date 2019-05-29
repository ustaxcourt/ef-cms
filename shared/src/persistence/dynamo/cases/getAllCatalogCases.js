const { query } = require('../../dynamodbClientService');
/**
 * getAllCatalogCases
 *
 * @param applicationContext
 * @returns {*}
 */
exports.getAllCatalogCases = async ({ applicationContext }) => {
  return query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':pk': `catalog`,
      ':prefix': 'case',
    },
    KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
    applicationContext,
  });
};
