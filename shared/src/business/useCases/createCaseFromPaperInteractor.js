const { Case } = require('../entities/Case');
const { Document } = require('../entities/Document');
const { Message } = require('../entities/Message');
const { WorkItem } = require('../entities/WorkItem');

const {
  isAuthorized,
  START_PAPER_CASE,
} = require('../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../errors/errors');

const addPetitionDocumentWithWorkItemToCase = (
  user,
  caseToAdd,
  documentEntity,
) => {
  const message = `${documentEntity.documentType} filed by ${documentEntity.filedBy} is ready for review.`;

  const workItemEntity = new WorkItem({
    assigneeId: user.userId,
    assigneeName: user.name,
    caseId: caseToAdd.caseId,
    caseStatus: caseToAdd.status,
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
  });

  const newMessage = new Message({
    from: user.name,
    fromUserId: user.userId,
    message,
  });

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
 * @param petitionMetadata
 * @param petitionFileId
 * @param ownershipDisclosureFileId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.createCaseFromPaper = async ({
  applicationContext,
  ownershipDisclosureFileId,
  petitionFileId,
  petitionMetadata,
  stinFileId,
}) => {
  const user = applicationContext.getCurrentUser();
  if (!isAuthorized(user, START_PAPER_CASE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const Petition = applicationContext.getEntityConstructors().PetitionFromPaper;
  const petitionEntity = new Petition({
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

  const caseToAdd = new Case({
    userId: user.userId,
    ...petitionEntity.toRawObject(),
    docketNumber,
    isPaper: true,
  });

  caseToAdd.caseCaption = petitionEntity.caseCaption;
  const caseCaptionNames = Case.getCaseCaptionNames(caseToAdd.caseCaption);

  const petitionDocumentEntity = new Document({
    createdAt: caseToAdd.receivedAt,
    documentId: petitionFileId,
    documentType: Document.initialDocumentTypes.petitionFile,
    filedBy: caseCaptionNames,
    isPaper: true,
    userId: user.userId,
  });
  const {
    message: newMessage,
    workItem: newWorkItem,
  } = addPetitionDocumentWithWorkItemToCase(
    user,
    caseToAdd,
    petitionDocumentEntity,
  );

  if (stinFileId) {
    const stinDocumentEntity = new Document({
      createdAt: caseToAdd.receivedAt,
      documentId: stinFileId,
      documentType: Document.initialDocumentTypes.stin,
      filedBy: caseCaptionNames,
      isPaper: true,
      userId: user.userId,
    });
    caseToAdd.addDocumentWithoutDocketRecord(stinDocumentEntity);
  }

  if (ownershipDisclosureFileId) {
    const odsDocumentEntity = new Document({
      createdAt: caseToAdd.receivedAt,
      documentId: ownershipDisclosureFileId,
      documentType: Document.initialDocumentTypes.ownershipDisclosure,
      filedBy: caseCaptionNames,
      isPaper: true,
      userId: user.userId,
    });
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

  return new Case(caseToAdd).toRawObject();
};
