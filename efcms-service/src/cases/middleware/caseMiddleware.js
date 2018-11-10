const { create: getPersistence } = require('../../persistence/entityPersistenceFactory');
const uuidv4 = require('uuid/v4');
const client = require('../../middleware/dynamodbClientService');
const docketNumberService = require('./docketNumberGenerator');
const { isAuthorized, GET_CASES_BY_STATUS, UPDATE_CASE } = require('../../middleware/authorizationClientService');
const { UnprocessableEntityError, NotFoundError, UnauthorizedError } = require('../../middleware/errors');

const casesPersistence = getPersistence('cases');

const TABLE_NAME = process.env.STAGE ? `efcms-cases-${process.env.STAGE}` : 'efcms-cases-local';

const NUM_REQUIRED_DOCUMENTS = 3; //because 3 is a magic number

/**
 * validateDocuments
 *
 * checks that all case initiation documents are present
 *
 * @param documents
 */
const validateDocuments = documents => {
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
exports.create = async ({ userId, documents }) => {
  validateDocuments(documents);

  const caseId = uuidv4();

  const docketNumber = await docketNumberService.createDocketNumber();

  const params = {
    TableName: TABLE_NAME,
    Item: {
      caseId: caseId,
      createdAt: new Date().toISOString(),
      userId: userId,
      docketNumber: docketNumber,
      documents: documents,
      status: "new"
    },
    ConditionExpression: 'attribute_not_exists(#caseId)',
    ExpressionAttributeNames: {
      '#caseId': 'caseId',
    },
  };
  return client.put(params);

};

exports.getCase = async ({ userId, caseId }) => {
  const params = {
    TableName: TABLE_NAME,
    IndexName: "UserIdIndex",
    KeyConditionExpression: 'userId = :userId and caseId = :caseId',
    ExpressionAttributeValues: {
      ':userId': userId,
      ':caseId': caseId
    }
  };

  const caseRecord =  await client.query(params);

  if (caseRecord.length !== 1) {
    throw new NotFoundError(`Case ${caseId} was not found.`);
  }

  return caseRecord[0];
};

exports.getCases = ({ userId }) => {
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

exports.getCasesByStatus = async ({ status, userId }) => {
  if (!isAuthorized(userId, GET_CASES_BY_STATUS)) {
    throw new UnauthorizedError('Unauthorized for getCasesByStatus');
  } else {
    status = status.toLowerCase(); //homogenize for purity

    const params = {
      TableName: TABLE_NAME,
      IndexName: "StatusIndex",
      KeyConditionExpression: '#status = :status',
      ExpressionAttributeValues: {
        ':status': status
      },
      ExpressionAttributeNames: {
        "#status" : "status"
      }
    };
    return client.query(params);
  }
};

exports.updateCase = async ({ caseId, caseToUpdate, userId, persistence = casesPersistence}) => {
  if (!isAuthorized(userId, UPDATE_CASE)) {
    throw new UnauthorizedError('Unauthorized for update case');
  }

  if (caseId !== caseToUpdate.caseId) {
    throw new UnprocessableEntityError();
  }

  return persistence
    .save({
      entity: caseToUpdate,
      type: 'case'
    });
}



