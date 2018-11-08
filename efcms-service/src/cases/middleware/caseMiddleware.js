const uuidv4 = require('uuid/v4');
const client = require('../../middleware/dynamodbClientService');
const docketNumberService = require('./docketNumberGenerator');

const TABLE_NAME = process.env.STAGE ? `efcms-cases-${process.env.STAGE}` : 'efcms-cases-local';

const NUM_REQUIRED_DOCUMENTS = 3; //because 3 is a magic number

/**
 * validateDocuments
 *
 * checks that all case initiation documents are present
 *
 * @param documents
 */
const validateDocuments = (documents) => {
  if (!documents || !documents.constructor === Array || documents.length !== NUM_REQUIRED_DOCUMENTS) {
    throw new Error('Three case initiation documents are required');
  }
};

/**
 * create
 *
 * creates a case
 *
 * @param userId
 * @param documents
 * @returns {Promise.<void>}
 */
exports.create = async (userId, documents) => {
  validateDocuments(documents);

  const caseId = uuidv4();

  const docketNumber = await docketNumberService.createDocketNumber();

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

exports.getCase = async (userId, caseId) => {
  //TODO add expression to limit to user
  const params = {
    TableName: TABLE_NAME,
    KeyConditionExpression: 'userId = :userId and caseId = :caseId',
    ExpressionAttributeValues: {
      ':userId': userId,
      ':caseId': caseId
    }
  };
  return await client.query(params);
};

exports.getCases = (userId) => {
  //TODO add expression to limit to user
  const params = {
    TableName: TABLE_NAME,
    IndexName: "UserIdIndex",
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    }
  };
  return client.query(params);
};





