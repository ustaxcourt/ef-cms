const { create: getPersistence } = require('../../persistence/entityPersistenceFactory');
const uuidv4 = require('uuid/v4');
const docketNumberService = require('./docketNumberGenerator');
const { isAuthorized, GET_CASES_BY_STATUS, UPDATE_CASE } = require('../../middleware/authorizationClientService');
const { UnprocessableEntityError, NotFoundError, UnauthorizedError } = require('../../middleware/errors');
const casesPersistence = getPersistence('cases');
const Case = require('../../../../isomorphic/src/entities/Case');
const NUM_REQUIRED_DOCUMENTS = 3;

/**
 * validateCase
 *
 * checks that all case initiation documents are present
 *
 * @param documents
 */
const validateCase = caseToValidate => {
  if (!caseToValidate.isValid()) {
    throw new Error('The case was invalid');
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
exports.create = async ({ userId, documents, persistence = casesPersistence}) => {
  const caseId = uuidv4();
  const docketNumber = await docketNumberService.createDocketNumber();
  const caseToCreate = new Case({
    caseId: caseId,
    createdAt: new Date().toISOString(),
    userId: userId,
    docketNumber: docketNumber,
    documents: documents,
    status: "new"
  });
  validateCase(caseToCreate);
  return persistence
    .create({
      entity: caseToCreate,
      key: 'caseId',
      type: 'case'
    });
};

exports.getCase = async ({ userId, caseId, persistence = casesPersistence }) => {
  const caseRecord = await persistence
    .get({
      id: caseId,
      key: 'caseId',
      type: 'case'
    });

  if (!caseRecord) {
    throw new NotFoundError(`Case ${caseId} was not found.`);
  }

  if (caseRecord.userId !== userId) {
    throw new UnauthorizedError("something went wrong");
  }

  return caseRecord;
};

exports.getCases = ({ userId, persistence = casesPersistence }) => {
  return persistence
    .query({
      query: {
        userId,
      },
      pivot: 'user',
      type: 'case'
    });
};

exports.getCasesByStatus = async ({ status, userId, persistence = casesPersistence }) => {
  if (!isAuthorized(userId, GET_CASES_BY_STATUS)) {
    throw new UnauthorizedError('Unauthorized for getCasesByStatus');
  }

  status = status.toLowerCase();

  return persistence
    .query({
      query: {
        status,
      },
      pivot: 'status',
      type: 'case',
    })
};

exports.updateCase = ({ caseId, caseToUpdate, userId, persistence = casesPersistence}) => {
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



