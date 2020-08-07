const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const {
  UnauthorizedError,
  UnprocessableEntityError,
} = require('../../errors/errors');
const { Case } = require('../entities/cases/Case');
const { CaseInternal } = require('../entities/cases/CaseInternal');
const { ContactFactory } = require('../entities/contacts/ContactFactory');
const { INITIAL_DOCUMENT_TYPES_MAP } = require('../entities/EntityConstants');
const { isEmpty } = require('lodash');
const { WorkItem } = require('../entities/WorkItem');

/**
 * saveCaseDetailInternalEditInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case to update
 * @param {object} providers.caseToUpdate the updated case data
 * @returns {object} the updated case data
 */
exports.saveCaseDetailInternalEditInteractor = async ({
  applicationContext,
  caseToUpdate,
  docketNumber,
}) => {
  console.log('casetoupdate ', caseToUpdate);

  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.UPDATE_CASE)) {
    throw new UnauthorizedError('Unauthorized for update case');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  if (!caseToUpdate || docketNumber !== caseToUpdate.docketNumber) {
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

  const caseBeforeEdits = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const fullCase = {
    ...caseBeforeEdits,
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

  if (fullCase.isPaper) {
    // get current caseEntity in persistence
    const caseEntity = new CaseInternal(fullCase, {
      applicationContext,
    }).validate();

    // loop through INITIAL_DOCUMENTS_MAP (documentTYpe)
    const keys = Object.keys(INITIAL_DOCUMENT_TYPES_MAP);

    // for the documentType, if originalCaseEntity.documents[documentType].documentId !== caseEntity.documents[documentType].documentId
    for (const key of keys) {
      const { documentType } = INITIAL_DOCUMENT_TYPES_MAP[key];

      const originalCaseDocument = caseBeforeEdits.documents.find(
        doc => doc.documentType === documentType,
      );

      // application for waiver of filing fee file
      const currentCaseDocument = caseToUpdate[key];

      if (originalCaseDocument && currentCaseDocument) {
        if (
          originalCaseDocument.documentId === currentCaseDocument.documentId
        ) {
          // do nothing
        } else {
          // replace document
          await applicationContext
            .getPersistenceGateway()
            .saveDocumentFromLambda({
              applicationContext,
              document: currentCaseDocument,
              documentId: originalCaseDocument.documentId,
            });
        }
      }

      if (!originalCaseDocument && currentCaseDocument) {
        // newly added pdf
      }

      if (originalCaseDocument && !currentCaseDocument) {
        // remove pdf
      }
    }

    // we know the pdf has changed
    // remove and/or replace pdf
  } else {
    const caseEntity = new Case(fullCase, { applicationContext }).validate();

    const petitionDocument = caseEntity.getPetitionDocument();

    const initializeCaseWorkItem = petitionDocument.workItem;

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
