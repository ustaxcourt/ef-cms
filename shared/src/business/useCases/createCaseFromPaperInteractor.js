const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { CaseInternal } = require('../entities/cases/CaseInternal');
const { Document } = require('../entities/Document');
const { INITIAL_DOCUMENT_TYPES } = require('../entities/EntityConstants');
const { Message } = require('../entities/Message');
const { replaceBracketed } = require('../utilities/replaceBracketed');
const { UnauthorizedError } = require('../../errors/errors');
const { WorkItem } = require('../entities/WorkItem');

const addPetitionDocumentWithWorkItemToCase = ({
  applicationContext,
  caseToAdd,
  documentEntity,
  user,
}) => {
  const message = `${documentEntity.documentType} filed by ${documentEntity.filedBy} is ready for review.`;

  const workItemEntity = new WorkItem(
    {
      assigneeId: user.userId,
      assigneeName: user.name,
      associatedJudge: caseToAdd.associatedJudge,
      caseIsInProgress: true,
      caseStatus: caseToAdd.status,
      caseTitle: Case.getCaseTitle(Case.getCaseCaption(caseToAdd)),
      docketNumber: caseToAdd.docketNumber,
      docketNumberWithSuffix: caseToAdd.docketNumberWithSuffix,
      document: {
        ...documentEntity.toRawObject(),
        createdAt: documentEntity.createdAt,
      },
      isInitializeCase: true,
      isQC: true,
      section: user.section,
      sentBy: user.name,
      sentBySection: user.section,
      sentByUserId: user.userId,
    },
    { applicationContext },
  );

  const newMessage = new Message(
    {
      from: user.name,
      fromUserId: user.userId,
      message,
      to: user.name,
      toUserId: user.userId,
    },
    { applicationContext },
  );

  workItemEntity.addMessage(newMessage);

  documentEntity.addWorkItem(workItemEntity);
  caseToAdd.addDocument(documentEntity, { applicationContext });

  return {
    workItem: workItemEntity,
  };
};

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.ownershipDisclosureFileId the id of the ownership disclosure file
 * @param {string} providers.petitionFileId the id of the petition file
 * @param {string} providers.petitionMetadata the petition metadata
 * @param {string} providers.requestForPlaceOfTrialFileId the id of the request for place of trial file
 * @param {string} providers.stinFileId the id of the stin file
 * @returns {object} the created case
 */
exports.createCaseFromPaperInteractor = async ({
  applicationContext,
  applicationForWaiverOfFilingFeeFileId,
  ownershipDisclosureFileId,
  petitionFileId,
  petitionMetadata,
  requestForPlaceOfTrialFileId,
  stinFileId,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.START_PAPER_CASE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  const petitionEntity = new CaseInternal(
    {
      ...petitionMetadata,
      applicationForWaiverOfFilingFeeFileId,
      ownershipDisclosureFileId,
      petitionFileId,
      stinFileId,
    },
    { applicationContext },
  ).validate();

  // invoke the createCase interactor
  const docketNumber = await applicationContext.docketNumberGenerator.createDocketNumber(
    {
      applicationContext,
    },
  );

  const caseToAdd = new Case(
    {
      docketNumber,
      ...petitionEntity.toRawObject(),
      inProgress: petitionMetadata.inProgress,
      isPaper: true,
      status: petitionMetadata.status || null,
      userId: user.userId,
    },
    {
      applicationContext,
    },
  );

  caseToAdd.caseCaption = petitionEntity.caseCaption;

  let partySecondary = false;
  if (
    petitionMetadata.contactSecondary &&
    petitionMetadata.contactSecondary.name
  ) {
    partySecondary = true;
  }

  const petitionDocumentEntity = new Document(
    {
      createdAt: caseToAdd.receivedAt,
      documentId: petitionFileId,
      documentType: INITIAL_DOCUMENT_TYPES.petition.documentType,
      eventCode: INITIAL_DOCUMENT_TYPES.petition.eventCode,
      filingDate: caseToAdd.receivedAt,
      isFileAttached: true,
      isPaper: true,
      mailingDate: petitionEntity.mailingDate,
      partyPrimary: true,
      partySecondary,
      receivedAt: caseToAdd.receivedAt,
      userId: user.userId,
      ...caseToAdd.getCaseContacts({
        contactPrimary: true,
        contactSecondary: true,
      }),
    },
    { applicationContext },
  );

  const { workItem: newWorkItem } = addPetitionDocumentWithWorkItemToCase({
    applicationContext,
    caseToAdd,
    documentEntity: petitionDocumentEntity,
    user,
  });

  if (applicationForWaiverOfFilingFeeFileId) {
    let {
      documentTitle,
    } = INITIAL_DOCUMENT_TYPES.applicationForWaiverOfFilingFee;

    const applicationForWaiverOfFilingFeeDocumentEntity = new Document(
      {
        createdAt: caseToAdd.receivedAt,
        documentId: applicationForWaiverOfFilingFeeFileId,
        documentTitle,
        documentType:
          INITIAL_DOCUMENT_TYPES.applicationForWaiverOfFilingFee.documentType,
        eventCode:
          INITIAL_DOCUMENT_TYPES.applicationForWaiverOfFilingFee.eventCode,
        filingDate: caseToAdd.receivedAt,
        isFileAttached: true,
        isPaper: true,
        mailingDate: petitionEntity.mailingDate,
        partyPrimary: true,
        partySecondary,
        receivedAt: caseToAdd.receivedAt,
        userId: user.userId,
        ...caseToAdd.getCaseContacts({
          contactPrimary: true,
          contactSecondary: true,
        }),
      },
      { applicationContext },
    );

    caseToAdd.addDocument(applicationForWaiverOfFilingFeeDocumentEntity, {
      applicationContext,
    });
  }

  if (requestForPlaceOfTrialFileId) {
    let { documentTitle } = INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial;
    if (caseToAdd.preferredTrialCity) {
      documentTitle = replaceBracketed(
        documentTitle,
        caseToAdd.preferredTrialCity,
      );
    }

    const requestForPlaceOfTrialDocumentEntity = new Document(
      {
        createdAt: caseToAdd.receivedAt,
        documentId: requestForPlaceOfTrialFileId,
        documentTitle,
        documentType:
          INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.documentType,
        eventCode: INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.eventCode,
        filingDate: caseToAdd.receivedAt,
        isFileAttached: true,
        isPaper: true,
        mailingDate: petitionEntity.mailingDate,
        partyPrimary: true,
        partySecondary,
        receivedAt: caseToAdd.receivedAt,
        userId: user.userId,
        ...caseToAdd.getCaseContacts({
          contactPrimary: true,
          contactSecondary: true,
        }),
      },
      { applicationContext },
    );

    caseToAdd.addDocument(requestForPlaceOfTrialDocumentEntity, {
      applicationContext,
    });
  }

  if (stinFileId) {
    const stinDocumentEntity = new Document(
      {
        createdAt: caseToAdd.receivedAt,
        documentId: stinFileId,
        documentType: INITIAL_DOCUMENT_TYPES.stin.documentType,
        eventCode: INITIAL_DOCUMENT_TYPES.stin.eventCode,
        filingDate: caseToAdd.receivedAt,
        isFileAttached: true,
        isPaper: true,
        mailingDate: petitionEntity.mailingDate,
        partyPrimary: true,
        partySecondary,
        receivedAt: caseToAdd.receivedAt,
        userId: user.userId,
        ...caseToAdd.getCaseContacts({
          contactPrimary: true,
          contactSecondary: true,
        }),
      },
      { applicationContext },
    );

    caseToAdd.addDocumentWithoutDocketRecord(stinDocumentEntity, {
      applicationContext,
    });
  }

  if (ownershipDisclosureFileId) {
    const odsDocumentEntity = new Document(
      {
        createdAt: caseToAdd.receivedAt,
        documentId: ownershipDisclosureFileId,
        documentType: INITIAL_DOCUMENT_TYPES.ownershipDisclosure.documentType,
        eventCode: INITIAL_DOCUMENT_TYPES.ownershipDisclosure.eventCode,
        filingDate: caseToAdd.receivedAt,
        isFileAttached: true,
        isPaper: true,
        mailingDate: petitionEntity.mailingDate,
        partyPrimary: true,
        partySecondary,
        receivedAt: caseToAdd.receivedAt,
        userId: user.userId,
        ...caseToAdd.getCaseContacts({
          contactPrimary: true,
          contactSecondary: true,
        }),
      },
      { applicationContext },
    );

    caseToAdd.addDocument(odsDocumentEntity, { applicationContext });
  }

  await Promise.all([
    applicationContext.getPersistenceGateway().createCase({
      applicationContext,
      caseToCreate: caseToAdd.validate().toRawObject(),
    }),
    applicationContext.getPersistenceGateway().saveWorkItemForPaper({
      applicationContext,
      workItem: newWorkItem.validate().toRawObject(),
    }),
  ]);

  return new Case(caseToAdd, { applicationContext }).toRawObject();
};
