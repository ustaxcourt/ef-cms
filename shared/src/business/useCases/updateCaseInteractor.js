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

/**
 * updateCaseInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to update
 * @param {object} providers.caseToUpdate the updated case data
 * @returns {object} the updated case data
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

  if (!isEmpty(caseToUpdate.contactPrimary)) {
    caseToUpdate.contactPrimary = ContactFactory.createContacts({
      contactInfo: { primary: caseToUpdate.contactPrimary },
      partyType: caseToUpdate.partyType,
    }).primary.toRawObject();
  }

  if (!isEmpty(caseToUpdate.contactSecondary)) {
    caseToUpdate.contactSecondary = ContactFactory.createContacts({
      contactInfo: { secondary: caseToUpdate.contactSecondary },
      partyType: caseToUpdate.partyType,
    }).secondary.toRawObject();
  }

  const paidCase = new Case(caseToUpdate, { applicationContext })
    .markAsPaidByPayGov(caseToUpdate.payGovDate)
    .setRequestForTrialDocketRecord(caseToUpdate.preferredTrialCity)
    .validate()
    .toRawObject();

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: paidCase,
  });

  return paidCase;
};
