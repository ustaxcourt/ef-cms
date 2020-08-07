const {
  INITIAL_DOCUMENT_TYPES,
  INITIAL_DOCUMENT_TYPES_MAP,
} = require('../entities/EntityConstants');
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
const { Document } = require('../entities/Document');
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

  const caseWithFormEdits = {
    ...caseRecord,
    ...editableFields,
  };

  const caseEntity = new Case(caseWithFormEdits, {
    applicationContext,
  });

  if (!isEmpty(caseWithFormEdits.contactPrimary)) {
    caseWithFormEdits.contactPrimary = ContactFactory.createContacts({
      applicationContext,
      contactInfo: { primary: caseWithFormEdits.contactPrimary },
      partyType: caseWithFormEdits.partyType,
    }).primary.toRawObject();
  }

  if (!isEmpty(caseWithFormEdits.contactSecondary)) {
    caseWithFormEdits.contactSecondary = ContactFactory.createContacts({
      applicationContext,
      contactInfo: { secondary: caseWithFormEdits.contactSecondary },
      partyType: caseWithFormEdits.partyType,
    }).secondary.toRawObject();
  }

  if (caseEntity.isPaper) {
    await updateInitialFilingDocuments({
      applicationContext,
      authorizedUser,
      caseRecord: caseEntity,
      caseToUpdate,
    });
  } else {
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

const addNewInitialFilingToCase = ({
  applicationContext,
  authorizedUser,
  caseRecord,
  currentCaseDocument,
  documentType,
}) => {
  const { eventCode } = Object.values(INITIAL_DOCUMENT_TYPES).find(
    dt => dt.documentType === documentType,
  );
  const documentToAdd = new Document(
    {
      ...currentCaseDocument,
      eventCode,
      ...caseRecord.getCaseContacts({
        contactPrimary: true,
        contactSecondary: true,
      }),
      userId: authorizedUser.userId,
    },
    { applicationContext },
  );
  caseRecord.documents.push(documentToAdd);
};

const deleteInitialFilingFromCase = async ({
  applicationContext,
  caseRecord,
  originalCaseDocument,
}) => {
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
};

const updateInitialFilingDocuments = async ({
  applicationContext,
  authorizedUser,
  caseRecord,
  caseToUpdate,
}) => {
  for (const key of Object.keys(INITIAL_DOCUMENT_TYPES_MAP)) {
    const documentType = INITIAL_DOCUMENT_TYPES_MAP[key];
    const originalCaseDocument = caseRecord.documents.find(
      doc => doc.documentType === documentType,
    );
    const currentCaseDocument = caseToUpdate.documents.find(
      doc => doc.documentType === documentType,
    );

    if (originalCaseDocument && currentCaseDocument) {
      if (originalCaseDocument.documentId !== currentCaseDocument.documentId) {
        originalCaseDocument.documentId = currentCaseDocument.documentId;
      }
    }

    if (!originalCaseDocument && currentCaseDocument) {
      addNewInitialFilingToCase({
        applicationContext,
        authorizedUser,
        caseRecord,
        currentCaseDocument,
        documentType,
      });
    }

    if (originalCaseDocument && !currentCaseDocument) {
      await deleteInitialFilingFromCase({
        applicationContext,
        caseRecord,
        originalCaseDocument,
      });
    }
  }
};
