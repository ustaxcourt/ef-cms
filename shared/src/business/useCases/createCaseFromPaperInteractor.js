const { Case } = require('../entities/Case');
const { DocketRecord } = require('../entities/DocketRecord');
const { Document } = require('../entities/Document');
const { Message } = require('../entities/Message');
const { WorkItem } = require('../entities/WorkItem');

const { capitalize } = require('lodash');

const {
  isAuthorized,
  START_PAPER_CASE,
} = require('../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../errors/errors');
const { PETITIONS_SECTION } = require('../entities/WorkQueue');

const addDocumentToCase = (user, caseToAdd, documentEntity) => {
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
    section: PETITIONS_SECTION,
    sentBy: user.userId,
  });

  let message;

  if (documentEntity.documentType === 'Petition') {
    const caseCaptionNames = Case.getCaseCaptionNames(caseToAdd.caseCaption);
    message = `${
      documentEntity.documentType
    } filed by ${caseCaptionNames} is ready for review.`;
  } else {
    message = `${documentEntity.documentType} filed by ${capitalize(
      user.role,
    )} is ready for review.`;
  }

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
  });

  caseToAdd.caseCaption = petitionEntity.caseCaption;

  const petitionDocumentEntity = new Document({
    documentId: petitionFileId,
    documentType: Case.documentTypes.petitionFile,
    filedBy: user.name,
    userId: user.userId,
  });
  addDocumentToCase(user, caseToAdd, petitionDocumentEntity);

  caseToAdd.addDocketRecord(
    new DocketRecord({
      description: `Request for Place of Trial at ${
        caseToAdd.preferredTrialCity
      }`,
      filingDate: caseToAdd.createdAt,
    }),
  );

  if (stinFileId) {
    const stinDocumentEntity = new Document({
      documentId: stinFileId,
      documentType: Case.documentTypes.stin,
      filedBy: user.name,
      userId: user.userId,
    });
    caseToAdd.addDocumentWithoutDocketRecord(stinDocumentEntity);
  }

  if (ownershipDisclosureFileId) {
    const odsDocumentEntity = new Document({
      documentId: ownershipDisclosureFileId,
      documentType: Case.documentTypes.ownershipDisclosure,
      filedBy: user.name,
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
