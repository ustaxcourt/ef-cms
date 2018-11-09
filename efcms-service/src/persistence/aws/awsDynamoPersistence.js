const uuidv4 = require('uuid/v4');
const environment = require('../../environment');
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

exports.createDocument = ({ userId, documentType }) => {
  const documentId = uuidv4();
  const params = {
    TableName: environment.get('DOCUMENTS_TABLE'),
    Item: {
      documentId: documentId,
      createdAt: new Date(),
      userId: userId,
      documentType: documentType,
    },
    ConditionExpression: 'attribute_not_exists(#documentId)',
    ExpressionAttributeNames: {
      '#documentId': 'documentId',
    },
  };

  return client.put(params);
};

