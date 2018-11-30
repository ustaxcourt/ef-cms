// const Case = require('../entities/Case');
const moment = require('moment');
const {
  isAuthorized,
  UPDATE_CASE,
} = require('../authorization/authorizationClientService');

const {
  UnprocessableEntityError,
  UnauthorizedError,
} = require('../errors/errors');

exports.sendToIRS = ({ caseRecord, userId, applicationContext }) => {
  if (!isAuthorized(userId, UPDATE_CASE)) {
    throw new UnauthorizedError('Unauthorized for send to IRS');
  }

  //caseRecord.validate(); just use the documents validation somehow?
  const allDocumentsValidated = caseRecord.documents.every(
    document => document.validated === true,
  );

  if (!allDocumentsValidated) {
    throw new UnprocessableEntityError(
      'Please validate all documents before sending to IRS.',
    );
  }

  if (allDocumentsValidated) {
    //call function to actually send to IRS here then set the date and status
    caseRecord.irsSendDate = new Date();
    caseRecord.status = 'general';
    caseRecord.documents.every(document => (document.status = 'served'));
  }
  return applicationContext.persistence.sendToIRS({
    caseToSend: caseRecord.getRawValues(),
    applicationContext,
  });
};
