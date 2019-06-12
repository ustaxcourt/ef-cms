const {
  isAuthorized,
  PETITION,
} = require('../../authorization/authorizationClientService');
const { capitalize } = require('lodash');
const { Case } = require('../entities/Case');
const { DocketRecord } = require('../entities/DocketRecord');
const { Document } = require('../entities/Document');
const { Message } = require('../entities/Message');
const { PETITIONS_SECTION } = require('../entities/WorkQueue');
const { UnauthorizedError } = require('../../errors/errors');
const { WorkItem } = require('../entities/WorkItem');

const addDocumentToCase = (user, caseToAdd, documentEntity) => {
  const workItemEntity = new WorkItem({
    assigneeId: null,
    assigneeName: null,
    caseId: caseToAdd.caseId,
    caseStatus: caseToAdd.status,
    docketNumber: caseToAdd.docketNumber,
    docketNumberSuffix: caseToAdd.docketNumberSuffix,
    document: {
      ...documentEntity.toRawObject(),
      createdAt: documentEntity.createdAt,
    },
    isInitializeCase: documentEntity.isPetitionDocument() ? true : false,
    isInternal: false,
    section: PETITIONS_SECTION,
    sentBy: user.userId,
  });

  let message;

  if (documentEntity.documentType === 'Petition') {
    const caseCaptionNames = Case.getCaseCaptionNames(caseToAdd.caseCaption);
    message = `${documentEntity.documentType} filed by ${caseCaptionNames} is ready for review.`;
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

  return workItemEntity;
};

/**
 *
 * @param petitionMetadata
 * @param petitionFileId
 * @param ownershipDisclosureFileId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.createCase = async ({
  applicationContext,
  ownershipDisclosureFileId,
  petitionFileId,
  petitionMetadata,
  stinFileId,
}) => {
  const user = applicationContext.getCurrentUser();
  if (!isAuthorized(user, PETITION)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const Petition = applicationContext.getEntityConstructors().Petition;
  const petitionEntity = new Petition(petitionMetadata).validate();

  // invoke the createCase interactor
  const docketNumber = await applicationContext.docketNumberGenerator.createDocketNumber(
    {
      applicationContext,
    },
  );

  let practitioners = [];
  if (user.role === 'practitioner') {
    const practitionerUser = await applicationContext
      .getPersistenceGateway()
      .getUserById({
        applicationContext,
        userId: user.userId,
      });
    practitioners = [practitionerUser];
  }

  const caseToAdd = new Case({
    userId: user.userId,
    practitioners,
    ...petitionEntity.toRawObject(),
    docketNumber,
    isPaper: false,
  });

  caseToAdd.caseCaption = Case.getCaseCaption(caseToAdd);

  const petitionDocumentEntity = new Document({
    documentId: petitionFileId,
    documentType: Document.initialDocumentTypes.petitionFile,
    filedBy: user.name,
    practitioner: practitioners[0],
    userId: user.userId,
  });
  petitionDocumentEntity.generateFiledBy(caseToAdd);
  const newWorkItem = addDocumentToCase(
    user,
    caseToAdd,
    petitionDocumentEntity,
  );

  caseToAdd.addDocketRecord(
    new DocketRecord({
      description: `Request for Place of Trial at ${caseToAdd.preferredTrialCity}`,
      filingDate: caseToAdd.receivedAt || caseToAdd.createdAt,
    }),
  );

  const stinDocumentEntity = new Document({
    documentId: stinFileId,
    documentType: Document.initialDocumentTypes.stin,
    filedBy: user.name,
    practitioner: practitioners[0],
    userId: user.userId,
  });
  stinDocumentEntity.generateFiledBy(caseToAdd);
  caseToAdd.addDocumentWithoutDocketRecord(stinDocumentEntity);

  if (ownershipDisclosureFileId) {
    const odsDocumentEntity = new Document({
      documentId: ownershipDisclosureFileId,
      documentType: Document.initialDocumentTypes.ownershipDisclosure,
      filedBy: user.name,
      practitioner: practitioners[0],
      userId: user.userId,
    });
    odsDocumentEntity.generateFiledBy(caseToAdd);
    caseToAdd.addDocument(odsDocumentEntity);
  }

  await applicationContext.getPersistenceGateway().createCase({
    applicationContext,
    caseToCreate: caseToAdd.validate().toRawObject(),
  });

  await applicationContext.getPersistenceGateway().saveWorkItemForNonPaper({
    applicationContext,
    workItem: newWorkItem.validate().toRawObject(),
  });

  return new Case(caseToAdd).toRawObject();
};
