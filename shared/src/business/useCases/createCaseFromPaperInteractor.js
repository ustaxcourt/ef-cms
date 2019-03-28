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
  const message = `${documentEntity.documentType} filed by ${
    documentEntity.filedBy
  } is ready for review.`;

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
    isInitializeCase: documentEntity.isPetitionDocument() ? true : false,
    section: user.section,
    sentBy: user.userId,
  });

  workItemEntity.addMessage(
    new Message({
      from: user.name,
      fromUserId: user.userId,
      message,
    }),
  );

  documentEntity.addWorkItem(workItemEntity);
  caseToAdd.addDocument(documentEntity);
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

  // TODO: I'm pretty sure this needs to be PetitionFromPaperWithoutFiles, and we need to create that entity
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
    documentId: petitionFileId,
    documentType: Case.documentTypes.petitionFile,
    filedBy: caseCaptionNames,
    userId: user.userId,
  });
  addPetitionDocumentWithWorkItemToCase(
    user,
    caseToAdd,
    petitionDocumentEntity,
  );

  if (stinFileId) {
    const stinDocumentEntity = new Document({
      documentId: stinFileId,
      documentType: Case.documentTypes.stin,
      filedBy: caseCaptionNames,
      userId: user.userId,
    });
    caseToAdd.addDocumentWithoutDocketRecord(stinDocumentEntity);
  }

  if (ownershipDisclosureFileId) {
    const odsDocumentEntity = new Document({
      documentId: ownershipDisclosureFileId,
      documentType: Case.documentTypes.ownershipDisclosure,
      filedBy: caseCaptionNames,
      userId: user.userId,
    });
    caseToAdd.addDocument(odsDocumentEntity);
  }

  await applicationContext.getPersistenceGateway().saveCase({
    applicationContext,
    caseToSave: caseToAdd.validate().toRawObject(),
  });

  return new Case(caseToAdd).toRawObject();
};
