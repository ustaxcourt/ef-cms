const Case = require('../entities/Case');
const getCaseUC = require('./getCase');
const {
  isAuthorized,
  UPDATE_CASE,
} = require('../authorization/authorizationClientService');

const {
  UnprocessableEntityError,
  UnauthorizedError,
  InvalidEntityError,
} = require('../errors/errors');

exports.sendIRSPetitionPackage = async ({ caseId, userId, applicationContext }) => {
  if (!isAuthorized(userId, UPDATE_CASE)) { //sendtoirs and update are same permission
    throw new UnauthorizedError('Unauthorized for send to IRS');
  }

  //get the case and detail
  const caseRecord = await getCaseUC({
    userId,
    caseId,
    applicationContext,
  });

  let caseEntity;
  if (!caseRecord) {
    throw new UnprocessableEntityError("Case not found.");
  }

  caseEntity = new Case(caseRecord);
  if (!caseEntity.isValid()) {
    throw new InvalidEntityError("Invalid for send to IRS");
  }
  //call function to actually send to IRS here then set the date and status
  caseRecord.irsSendDate = new Date();
  caseRecord.status = "general";
  caseRecord.documents.every(document => (document.status = "served"));


  return applicationContext.persistence.sendToIRS({
    caseToSend: { ...caseEntity },
    applicationContext,
  });

  //update status on case
  //return updated case

};
