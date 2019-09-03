const {
  isAuthorized,
  PETITION,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { DocketRecord } = require('../entities/DocketRecord');
const { Document } = require('../entities/Document');
const { Message } = require('../entities/Message');
const { PETITIONS_SECTION } = require('../entities/WorkQueue');
const { UnauthorizedError } = require('../../errors/errors');
const { WorkItem } = require('../entities/WorkItem');

const addPetitionDocumentToCase = (user, caseToAdd, documentEntity) => {
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

  const caseCaptionNames = Case.getCaseCaptionNames(caseToAdd.caseCaption);
  message = `${documentEntity.documentType} filed by ${caseCaptionNames} is ready for review.`;

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
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.ownershipDisclosureFileId the id of the ownership disclosure file
 * @param {string} providers.petitionFileId the id of the petition file
 * @param {object} providers.petitionMetadata the petition metadata
 * @param {string} providers.stinFileId the id of the stin file
 * @returns {object} the created case
 */
exports.createCaseInteractor = async ({
  applicationContext,
  ownershipDisclosureFileId,
  petitionFileId,
  petitionMetadata,
  stinFileId,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, PETITION)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  const { CaseExternal } = applicationContext.getEntityConstructors();
  const petitionEntity = new CaseExternal(petitionMetadata).validate();

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

    practitionerUser.representingPrimary = true;
    if (
      petitionMetadata.contactSecondary &&
      petitionMetadata.contactSecondary.name
    ) {
      practitionerUser.representingSecondary = true;
    }

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
  const caseCaptionNames = Case.getCaseCaptionNames(caseToAdd.caseCaption);

  const petitionDocumentEntity = new Document({
    documentId: petitionFileId,
    documentType: Document.INITIAL_DOCUMENT_TYPES.petition.documentType,
    eventCode: Document.INITIAL_DOCUMENT_TYPES.petition.eventCode,
    filedBy: caseCaptionNames,
    practitioner: practitioners[0],
    userId: user.userId,
  });
  petitionDocumentEntity.generateFiledBy(caseToAdd);
  const newWorkItem = addPetitionDocumentToCase(
    user,
    caseToAdd,
    petitionDocumentEntity,
  );

  caseToAdd.addDocketRecord(
    new DocketRecord({
      description: `Request for Place of Trial at ${caseToAdd.preferredTrialCity}`,
      eventCode:
        Document.INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.eventCode,
      filingDate: caseToAdd.receivedAt || caseToAdd.createdAt,
    }),
  );

  const stinDocumentEntity = new Document({
    documentId: stinFileId,
    documentType: Document.INITIAL_DOCUMENT_TYPES.stin.documentType,
    eventCode: Document.INITIAL_DOCUMENT_TYPES.stin.eventCode,
    filedBy: caseCaptionNames,
    practitioner: practitioners[0],
    userId: user.userId,
  });
  stinDocumentEntity.generateFiledBy(caseToAdd);
  caseToAdd.addDocumentWithoutDocketRecord(stinDocumentEntity);

  if (ownershipDisclosureFileId) {
    const odsDocumentEntity = new Document({
      documentId: ownershipDisclosureFileId,
      documentType:
        Document.INITIAL_DOCUMENT_TYPES.ownershipDisclosure.documentType,
      eventCode: Document.INITIAL_DOCUMENT_TYPES.ownershipDisclosure.eventCode,
      filedBy: caseCaptionNames,
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
