const {
  create: getPersistence,
} = require('../../persistence/entityPersistenceFactory');
const {
  isAuthorized,
  GET_CASES_BY_STATUS,
  UPDATE_CASE,
} = require('../../middleware/authorizationClientService');
const {
  UnprocessableEntityError,
  NotFoundError,
  UnauthorizedError,
} = require('../../middleware/errors');
const casesPersistence = getPersistence('cases');

exports.getCase = async ({
  userId,
  caseId,
  persistence = casesPersistence,
}) => {
  const caseRecord = await persistence.get({
    id: caseId,
    key: 'caseId',
    type: 'case',
  });

  if (!caseRecord) {
    throw new NotFoundError(`Case ${caseId} was not found.`);
  }

  if (caseRecord.userId !== userId) {
    throw new UnauthorizedError('something went wrong');
  }

  return caseRecord;
};

exports.getCases = ({ userId, persistence = casesPersistence }) => {
  return persistence.query({
    query: {
      userId,
    },
    pivot: 'user',
    type: 'case',
  });
};

exports.getCasesByStatus = async ({
  status,
  userId,
  persistence = casesPersistence,
}) => {
  if (!isAuthorized(userId, GET_CASES_BY_STATUS)) {
    throw new UnauthorizedError('Unauthorized for getCasesByStatus');
  }

  status = status.toLowerCase();

  return persistence.query({
    query: {
      status,
    },
    pivot: 'status',
    type: 'case',
  });
};

exports.updateCase = ({
  caseId,
  caseToUpdate,
  userId,
  persistence = casesPersistence,
}) => {
  if (!isAuthorized(userId, UPDATE_CASE)) {
    throw new UnauthorizedError('Unauthorized for update case');
  }

  if (caseId !== caseToUpdate.caseId) {
    throw new UnprocessableEntityError();
  }

  return persistence.save({
    entity: caseToUpdate,
    type: 'case',
  });
};
