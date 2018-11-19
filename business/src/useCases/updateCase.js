const Case = require('../entities/Case');
const {
  isAuthorized,
  UPDATE_CASE,
} = require('../authorization/authorizationClientService');
const {
  UnprocessableEntityError,
  UnauthorizedError,
} = require('../errors/errors');

exports.updateCase = ({ caseId, caseJson, userId, applicationContext }) => {
  const caseToUpdate = new Case(caseJson);
  console.log(caseJson);
  caseToUpdate.validate();

  if (!isAuthorized(userId, UPDATE_CASE)) {
    throw new UnauthorizedError('Unauthorized for update case');
  }

  if (caseId !== caseJson.caseId) {
    throw new UnprocessableEntityError();
  }

  const allDocumentsValidated = caseJson.documents.every(
    document => document.validated === true,
  );
  if (allDocumentsValidated) {
    caseJson.status = 'general';
  }
  return applicationContext.persistence.saveCase({
    caseToSave: caseJson,
    applicationContext,
  });
};
