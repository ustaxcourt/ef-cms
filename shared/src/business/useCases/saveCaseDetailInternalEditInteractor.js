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

  let caseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  if (caseRecord.isPaper) {
    for (const key of Object.keys(INITIAL_DOCUMENT_TYPES_MAP)) {
      const documentType = INITIAL_DOCUMENT_TYPES_MAP[key];

      const originalCaseDocument = caseRecord.documents.find(
        doc => doc.documentType === documentType,
      );
      const currentCaseDocument = caseToUpdate.documents.find(
        doc => doc.documentType === documentType,
      );

      if (originalCaseDocument && currentCaseDocument) {
        if (
          originalCaseDocument.documentId !== currentCaseDocument.documentId
        ) {
          originalCaseDocument.documentId = currentCaseDocument.documentId;
          console.log('\n', '\n', caseRecord.documents, '\n');
        }
      }

      // if (!originalCaseDocument && currentCaseDocument) {
      //   // newly added pdf
      // }

      if (originalCaseDocument && !currentCaseDocument) {
        caseRecord.documents = caseRecord.documents.filter(
          item => item.documentId !== originalCaseDocument.documentId,
        );
        await applicationContext.getPersistenceGateway().deleteDocument({
          applicationContext,
          docketNumber: caseRecord.docketNumber,
          documentId: originalCaseDocument.documentId,
        });

        await applicationContext.getPersistenceGateway().deleteDocumentFromS3({
          applicationContext,
          key: originalCaseDocument.documentId,
        });
      }
    }
  } else {
    const petitionDocument = caseEntityWithFormEdits.getPetitionDocument();

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

  const caseRecordWithFormEdits = {
    ...caseRecord,
    ...editableFields,
  };

  if (!isEmpty(caseRecordWithFormEdits.contactPrimary)) {
    caseRecordWithFormEdits.contactPrimary = ContactFactory.createContacts({
      applicationContext,
      contactInfo: { primary: caseRecordWithFormEdits.contactPrimary },
      partyType: caseRecordWithFormEdits.partyType,
    }).primary.toRawObject();
  }

  if (!isEmpty(caseRecordWithFormEdits.contactSecondary)) {
    caseRecordWithFormEdits.contactSecondary = ContactFactory.createContacts({
      applicationContext,
      contactInfo: { secondary: caseRecordWithFormEdits.contactSecondary },
      partyType: caseRecordWithFormEdits.partyType,
    }).secondary.toRawObject();
  }

  const caseEntityWithFormEdits = new Case(caseRecordWithFormEdits, {
    applicationContext,
  });

  const updatedCase = await applicationContext
    .getPersistenceGateway()
    .updateCase({
      applicationContext,
      caseToUpdate: caseEntityWithFormEdits.validate().toRawObject(),
    });

  return new Case(updatedCase, { applicationContext }).toRawObject();
};
