const {
  isAuthorized,
  UPDATE_CASE,
} = require('../../authorization/authorizationClientService');
const {
  UnauthorizedError,
  UnprocessableEntityError,
} = require('../../errors/errors');
const { Case } = require('../entities/cases/Case');
const { ContactFactory } = require('../entities/contacts/ContactFactory');
const { isEmpty } = require('lodash');

const setDocumentDetails = (userId, documents) => {
  if (documents && userId) {
    documents.forEach(document => {
      if (document.validated && !document.reviewDate) {
        document.reviewDate = new Date().toISOString();
        document.reviewUser = userId;
        document.status = 'reviewed';
      }
    });
  }

  return documents;
};

/**
 * updateCaseInteractor
 *
 * @param caseId
 * @param caseToUpdate
 * @param userId
 * @param applicationContext
 * @returns {*}
 */
exports.updateCaseInteractor = async ({
  applicationContext,
  caseId,
  caseToUpdate,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, UPDATE_CASE)) {
    throw new UnauthorizedError('Unauthorized for update case');
  }

  if (!caseToUpdate || caseId !== caseToUpdate.caseId) {
    throw new UnprocessableEntityError();
  }

  if (caseToUpdate.documents) {
    caseToUpdate.documents = setDocumentDetails(
      user.userId,
      caseToUpdate.documents,
    );
  }

  if (caseToUpdate.contactPrimary && !isEmpty(caseToUpdate.contactPrimary)) {
    caseToUpdate.contactPrimary = ContactFactory.createContacts({
      contactInfo: { primary: caseToUpdate.contactPrimary },
      partyType: caseToUpdate.partyType,
    }).primary.toRawObject();
  }

  if (
    caseToUpdate.contactSecondary &&
    !isEmpty(caseToUpdate.contactSecondary)
  ) {
    caseToUpdate.contactSecondary = ContactFactory.createContacts({
      contactInfo: { secondary: caseToUpdate.contactSecondary },
      partyType: caseToUpdate.partyType,
    }).secondary.toRawObject();
  }

  const paidCase = new Case(caseToUpdate)
    .markAsPaidByPayGov(caseToUpdate.payGovDate)
    .setRequestForTrialDocketRecord(caseToUpdate.preferredTrialCity)
    .updateCaseTitleDocketRecord()
    .validate()
    .toRawObject();

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: paidCase,
  });

  return paidCase;
};
