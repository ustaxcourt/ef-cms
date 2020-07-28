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
const { WorkItem } = require('../entities/WorkItem');

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
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.UPDATE_CASE)) {
    throw new UnauthorizedError('Unauthorized for update case');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

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
    hasVerifiedIrsNotice: caseToUpdate.hasVerifiedIrsNotice,
    irsNoticeDate: caseToUpdate.irsNoticeDate,
    mailingDate: caseToUpdate.mailingDate,
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
    preferredTrialCity: caseToUpdate.preferredTrialCity,
    procedureType: caseToUpdate.procedureType,
    receivedAt: caseToUpdate.receivedAt,
    statistics: caseToUpdate.statistics,
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
      applicationContext,
      contactInfo: { primary: fullCase.contactPrimary },
      partyType: fullCase.partyType,
    }).primary.toRawObject();
  }

  if (!isEmpty(fullCase.contactSecondary)) {
    fullCase.contactSecondary = ContactFactory.createContacts({
      applicationContext,
      contactInfo: { secondary: fullCase.contactSecondary },
      partyType: fullCase.partyType,
    }).secondary.toRawObject();
  }

  const caseEntity = new Case(fullCase, { applicationContext }).validate();
  caseEntity.setRequestForTrialDocketRecord(fullCase.preferredTrialCity, {
    applicationContext,
  });

  if (!caseEntity.isPaper) {
    const petitionDocument = caseEntity.getPetitionDocument();

    const initializeCaseWorkItem = petitionDocument.workItems.find(
      workItem => workItem.isInitializeCase,
    );

    await applicationContext.getPersistenceGateway().deleteWorkItemFromInbox({
      applicationContext,
      workItem: initializeCaseWorkItem.validate().toRawObject(),
    });

    const workItemEntity = new WorkItem(
      {
        ...initializeCaseWorkItem,
        assigneeId: user.userId,
        assigneeName: user.name,
        caseIsInProgress: true,
      },
      { applicationContext },
    );

    await applicationContext.getPersistenceGateway().saveWorkItemForPaper({
      applicationContext,
      workItem: workItemEntity.validate().toRawObject(),
    });
  }

  const updatedCase = await applicationContext
    .getPersistenceGateway()
    .updateCase({
      applicationContext,
      caseToUpdate: caseEntity.validate().toRawObject(),
    });

  return new Case(updatedCase, { applicationContext }).toRawObject();
};
