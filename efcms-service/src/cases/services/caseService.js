const uuidv4 = require('uuid/v4');
const client = require('../../services/dynamodbClientService');
const docketNumberService = require('../services/docketNumberService');

const TABLE_NAME =
  process.env.CASES_DYNAMODB_TABLE || 'efcms-cases-dev';


exports.create = (userId, documents) => {
  const caseId = uuidv4();
  const docketNumber = docketNumberService.createDocketNumber();
  const params = {
    TableName: TABLE_NAME,
    Item: {
      caseId: caseId,
      createdAt: new Date(),
      userId: userId,
      docketNumber: docketNumber,
      documents: documents
    },
    ConditionExpression: 'attribute_not_exists(#caseId)',
    ExpressionAttributeNames: {
      '#caseId': 'caseId',
    },
  };

  return client.put(params);
};

