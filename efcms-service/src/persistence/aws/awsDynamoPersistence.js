const { get: getEnv } = require('../../environment');
const client = require('../../middleware/dynamodbClientService');

exports.updateCase = async ({ caseToUpdate }) => {
  const params = {
    TableName: getEnv('CASES_TABLE'),
    Item: caseToUpdate,
    ConditionExpression: 'attribute_exists(#caseId)',
    ExpressionAttributeNames: {
      '#caseId': 'caseId',
    },
  };
  return client.put(params);
}

