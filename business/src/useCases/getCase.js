const {
  isAuthorized,
  GET_CASE,
} = require('../authorization/authorizationClientService');
const { NotFoundError, UnauthorizedError } = require('../errors/errors');

exports.getCase = async ({ userId, caseId, applicationContext }) => {
  const caseRecord = await applicationContext.persistence.get({
    entity: { caseId, entityType: 'case' },
    applicationContext,
  });

  if (!caseRecord) {
    throw new NotFoundError(`Case ${caseId} was not found.`);
  }

  if (!isAuthorized(userId, GET_CASE, caseRecord.userId)) {
    throw new UnauthorizedError('Unauthorized for getCase');
  }

  return caseRecord;
};
