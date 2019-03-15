const client = require('../../dynamodbClientService');

/**
 * incrementCounter
 * @param applicationContext
 * @returns {*}
 */
exports.incrementCounter = ({ applicationContext, key }) => {
  const year = new Date().getFullYear().toString();

  return client.updateConsistent({
    applicationContext,
    ExpressionAttributeNames: {
      '#a': 'id',
    },
    ExpressionAttributeValues: {
      ':x': 1,
    },
    Key: {
      pk: `${key}-${year}`,
      sk: `${key}-${year}`,
    },
    ReturnValues: 'UPDATED_NEW',
    UpdateExpression: 'ADD #a :x',
  });
};
