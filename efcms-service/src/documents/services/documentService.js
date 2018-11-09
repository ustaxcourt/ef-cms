const uuidv4 = require('uuid/v4');
const client = require('../../middleware/dynamodbClientService');
const environment = require('../../environment');

exports.create = (userId, documentType) => {
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
