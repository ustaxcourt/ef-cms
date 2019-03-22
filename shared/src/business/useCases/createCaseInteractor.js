const { Case } = require('../entities/Case');
const WorkItem = require('../entities/WorkItem');
const DocketRecord = require('../entities/DocketRecord');
const Document = require('../entities/Document');
const Message = require('../entities/Message');
const { capitalize } = require('lodash');

const {
  isAuthorized,
  PETITION,
} = require('../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../errors/errors');
const { PETITIONS_SECTION } = require('../entities/WorkQueue');

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
exports.createCase = async ({
  petitionMetadata,
  petitionFileId,
  ownershipDisclosureFileId,
  applicationContext,
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

  const caseToAdd = new Case({
    userId: user.userId,
    ...petitionEntity.toRawObject(),
    petitioners: [
      {
        ...user.toRawObject(),
      },
    ],
    docketNumber,
  });

  caseToAdd.caseCaption = Case.getCaseCaption(caseToAdd);

  const petitionDocumentEntity = new Document({
    documentId: petitionFileId,
    documentType: Case.documentTypes.petitionFile,
    filedBy: user.name,
    userId: user.userId,
  });
  addDocumentToCase(user, caseToAdd, petitionDocumentEntity);

  const stinDocumentEntity = new Document({
    documentId: stinFileId,
    documentType: Case.documentTypes.stin,
    filedBy: user.name,
    userId: user.userId,
  });
  caseToAdd.addDocumentWithoutDocketRecord(stinDocumentEntity);

  caseToAdd.addDocketRecord(
    new DocketRecord({
      description: `Request for Place of Trial at ${
        caseToAdd.preferredTrialCity
      }`,
      filingDate: caseToAdd.createdAt,
    }),
  );

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
