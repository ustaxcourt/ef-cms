const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const {
  UnauthorizedError,
  UnprocessableEntityError,
} = require('../../errors/errors');
const { Case } = require('../entities/cases/Case');
const { ContactFactory } = require('../entities/contacts/ContactFactory');
const { isEmpty } = require('lodash');

/**
 * saveCaseDetailInternalEditInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to update
 * @param {object} providers.caseToUpdate the updated case data
 * @returns {object} the updated case data
 */
exports.saveCaseDetailInternalEditInteractor = async ({
  applicationContext,
  caseId,
  caseToUpdate,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.UPDATE_CASE)) {
    throw new UnauthorizedError('Unauthorized for update case');
  }

  if (!caseToUpdate || caseId !== caseToUpdate.caseId) {
    throw new UnprocessableEntityError();
  }

  const editableFields = {
    caseCaption: caseToUpdate.caseCaption,
    caseType: caseToUpdate.caseType,
    contactPrimary: caseToUpdate.contactPrimary,
    contactSecondary: caseToUpdate.contactSecondary,
    docketNumber: caseToUpdate.docketNumber,
    docketNumberSuffix: caseToUpdate.docketNumberSuffix,
    filingType: caseToUpdate.filingType,
    hasIrsNotice: caseToUpdate.hasIrsNotice,
    hasVerifiedIrsNotice: caseToUpdate.hasVerifiedIrsNotice,
    irsNoticeDate: caseToUpdate.irsNoticeDate,
    noticeOfAttachments: caseToUpdate.noticeOfAttachments,
    orderForAmendedPetition: caseToUpdate.orderForAmendedPetition,
    orderForAmendedPetitionAndFilingFee:
      caseToUpdate.orderForAmendedPetitionAndFilingFee,
    orderForFilingFee: caseToUpdate.orderForFilingFee,
    orderForOds: caseToUpdate.orderForOds,
    orderForRatification: caseToUpdate.orderForRatification,
    orderToShowCause: caseToUpdate.orderToShowCause,
    partyType: caseToUpdate.partyType,
    petitionPaymentDate: caseToUpdate.petitionPaymentDate,
    petitionPaymentMethod: caseToUpdate.petitionPaymentMethod,
    petitionPaymentStatus: caseToUpdate.petitionPaymentStatus,
    petitionPaymentWaivedDate: caseToUpdate.petitionPaymentWaivedDate,
    procedureType: caseToUpdate.procedureType,
  };

  const theCase = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });

  const fullCase = {
    ...theCase,
    ...editableFields,
  };

  if (!isEmpty(fullCase.contactPrimary)) {
    fullCase.contactPrimary = ContactFactory.createContacts({
      contactInfo: { primary: fullCase.contactPrimary },
      partyType: fullCase.partyType,
    }).primary.toRawObject();
  }

  if (!isEmpty(fullCase.contactSecondary)) {
    fullCase.contactSecondary = ContactFactory.createContacts({
      contactInfo: { secondary: fullCase.contactSecondary },
      partyType: fullCase.partyType,
    }).secondary.toRawObject();
  }

  const updatedCase = new Case(fullCase, { applicationContext })
    .setRequestForTrialDocketRecord(fullCase.preferredTrialCity, {
      applicationContext,
    })
    .validate()
    .toRawObject();

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: updatedCase,
  });

  return updatedCase;
};
