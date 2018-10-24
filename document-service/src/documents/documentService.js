const uuidv4 = require('uuid/v4');
const client = require('../services/dynamodbClientService');

const TABLE_NAME = process.env.DOCUMENTS_DYNAMODB_TABLE || 'efcms-documents-dev';

exports.create = (userId, documentType) => {
  const documentId = uuidv4();
  const params = {
    TableName: TABLE_NAME,
    Item: {
      'documentId': documentId,
      'createdAt': new Date(),
      'userId': userId,
      'documentType': documentType
    },
    ConditionExpression: "attribute_not_exists(#documentId)",
    ExpressionAttributeNames: {
      "#documentId" : "documentId"
    }
  };

  return client.put(params);

};