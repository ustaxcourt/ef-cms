const {
  isAuthorized,
  START_PAPER_CASE,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { Document } = require('../entities/Document');
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
      caseId: caseToAdd.caseId,
      caseStatus: caseToAdd.status,
      caseTitle: Case.getCaseCaptionNames(Case.getCaseCaption(caseToAdd)),
      docketNumber: caseToAdd.docketNumber,
      docketNumberSuffix: caseToAdd.docketNumberSuffix,
      document: {
        ...documentEntity.toRawObject(),
        createdAt: documentEntity.createdAt,
      },
      isInitializeCase: documentEntity.isPetitionDocument(),
      isInternal: false,
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
  caseToAdd.addDocument(documentEntity);

  return {
    message: newMessage,
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
  ownershipDisclosureFileId,
  petitionFileId,
  petitionMetadata,
  requestForPlaceOfTrialFileId,
  stinFileId,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, START_PAPER_CASE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  const { CaseInternal } = applicationContext.getEntityConstructors();
  const petitionEntity = new CaseInternal({
    ...petitionMetadata,
    ownershipDisclosureFileId,
    petitionFileId,
    stinFileId,
  }).validate();

  // invoke the createCase interactor
  const docketNumber = await applicationContext.docketNumberGenerator.createDocketNumber(
    {
      applicationContext,
    },
  );

  const caseToAdd = new Case(
    {
      userId: user.userId,
      ...petitionEntity.toRawObject(),
      docketNumber,
      isPaper: true,
    },
    {
      applicationContext,
    },
  );

  caseToAdd.caseCaption = petitionEntity.caseCaption;
  const caseCaptionNames = Case.getCaseCaptionNames(caseToAdd.caseCaption);

  const petitionDocumentEntity = new Document(
    {
      createdAt: caseToAdd.receivedAt,
      documentId: petitionFileId,
      documentType: Document.INITIAL_DOCUMENT_TYPES.petition.documentType,
      eventCode: Document.INITIAL_DOCUMENT_TYPES.petition.eventCode,
      filedBy: caseCaptionNames,
      isPaper: true,
      receivedAt: caseToAdd.receivedAt,
      userId: user.userId,
    },
    { applicationContext },
  );

  const {
    message: newMessage,
    workItem: newWorkItem,
  } = addPetitionDocumentWithWorkItemToCase({
    applicationContext,
    caseToAdd,
    documentEntity: petitionDocumentEntity,
    user,
  });

  if (requestForPlaceOfTrialFileId) {
    let {
      documentTitle,
    } = Document.INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial;
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
          Document.INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.documentType,
        eventCode:
          Document.INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.eventCode,
        filedBy: caseCaptionNames,
        isPaper: true,
        receivedAt: caseToAdd.receivedAt,
        userId: user.userId,
      },
      { applicationContext },
    );
    caseToAdd.addDocument(requestForPlaceOfTrialDocumentEntity);
  }

  if (stinFileId) {
    const stinDocumentEntity = new Document(
      {
        createdAt: caseToAdd.receivedAt,
        documentId: stinFileId,
        documentType: Document.INITIAL_DOCUMENT_TYPES.stin.documentType,
        eventCode: Document.INITIAL_DOCUMENT_TYPES.stin.eventCode,
        filedBy: caseCaptionNames,
        isPaper: true,
        receivedAt: caseToAdd.receivedAt,
        userId: user.userId,
      },
      { applicationContext },
    );
    caseToAdd.addDocumentWithoutDocketRecord(stinDocumentEntity);
  }

  if (ownershipDisclosureFileId) {
    const odsDocumentEntity = new Document(
      {
        createdAt: caseToAdd.receivedAt,
        documentId: ownershipDisclosureFileId,
        documentType:
          Document.INITIAL_DOCUMENT_TYPES.ownershipDisclosure.documentType,
        eventCode:
          Document.INITIAL_DOCUMENT_TYPES.ownershipDisclosure.eventCode,
        filedBy: caseCaptionNames,
        isPaper: true,
        receivedAt: caseToAdd.receivedAt,
        userId: user.userId,
      },
      { applicationContext },
    );
    caseToAdd.addDocument(odsDocumentEntity);
  }

  await applicationContext.getPersistenceGateway().createCase({
    applicationContext,
    caseToCreate: caseToAdd.validate().toRawObject(),
  });

  await applicationContext.getPersistenceGateway().saveWorkItemForPaper({
    applicationContext,
    messageId: newMessage.messageId,
    workItem: newWorkItem.validate().toRawObject(),
  });

  return new Case(caseToAdd, { applicationContext }).toRawObject();
};
