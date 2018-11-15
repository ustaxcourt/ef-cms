const { create: getPersistence } = require('../../persistence/entityPersistenceFactory');
const uuidv4 = require('uuid/v4');
const docketNumberService = require('./docketNumberGenerator');
const { isAuthorized, GET_CASES_BY_STATUS, UPDATE_CASE, GET_CASE } = require('../../middleware/authorizationClientService');
const { UnprocessableEntityError, NotFoundError, UnauthorizedError } = require('../../middleware/errors');
const casesPersistence = getPersistence('cases');

const NUM_REQUIRED_DOCUMENTS = 3;

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
exports.create = async ({ userId, documents, persistence = casesPersistence}) => {
  validateDocuments(documents);
  const caseId = uuidv4();
  const docketNumber = await docketNumberService.createDocketNumber();
  const caseToCreate = {
    caseId: caseId,
    createdAt: new Date().toISOString(),
    userId: userId,
    docketNumber: docketNumber,
    documents: documents,
    status: "new",
    validated: false
  }

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

  if (!isAuthorized(userId, GET_CASE, caseRecord.userId)) {
    throw new UnauthorizedError('Unauthorized for getCase');
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

  const allDocumentsValidated = caseToUpdate.documents.every(
    document => document.validated === true
  )
  if (allDocumentsValidated) {
    caseToUpdate.status = 'general';
  }
  return persistence
    .save({
      entity: caseToUpdate,
      type: 'case'
    });
}
