const client = require('../../dynamodbClientService');

/**
 * incrementCounter
 * @param applicationContext
 * @returns {*}
 */
// TODO: Hard coded to update the docketNumberCounter, but should
// be refactored to update any type of atomic counter in dynamo
// if we can pass in table / key
exports.incrementCounter = ({ applicationContext }) => {
  const TABLE = `efcms-${applicationContext.environment.stage}`;

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
      pk: `docketNumberCounter-${year}`,
      sk: `docketNumberCounter-${year}`,
    },
    ReturnValues: 'UPDATED_NEW',
    TableName: TABLE,
    UpdateExpression: 'ADD #a :x',
  });
};
