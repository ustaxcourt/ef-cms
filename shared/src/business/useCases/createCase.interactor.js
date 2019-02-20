const Case = require('../entities/Case');
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
    sentBy: user.userId,
    caseId: caseToAdd.caseId,
    document: {
      ...documentEntity.toRawObject(),
      createdAt: documentEntity.createdAt,
    },
    isInitializeCase: documentEntity.isPetitionDocument() ? true : false,
    caseStatus: caseToAdd.status,
    assigneeId: null,
    docketNumber: caseToAdd.docketNumber,
    docketNumberSuffix: caseToAdd.docketNumberSuffix,
    section: PETITIONS_SECTION,
    assigneeName: null,
  });

  workItemEntity.addMessage(
    new Message({
      message: `A ${documentEntity.documentType} filed by ${capitalize(
        user.role,
      )} is ready for review.`,
      sentBy: user.name,
      createdAt: new Date().toISOString(),
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

  caseToAdd.addDocketRecord(
    new DocketRecord({
      filingDate: caseToAdd.createdAt,
      description: `Request for Place of Trial at ${
        caseToAdd.preferredTrialCity
      }`,
    }),
  );

  const petitionDocumentEntity = new Document({
    documentId: petitionFileId,
    documentType: Case.documentTypes.petitionFile,
    userId: user.userId,
    filedBy: 'Petitioner',
  });
  addDocumentToCase(user, caseToAdd, petitionDocumentEntity);

  if (ownershipDisclosureFileId) {
    const odsDocumentEntity = new Document({
      documentId: ownershipDisclosureFileId,
      documentType: Case.documentTypes.ownershipDisclosure,
      userId: user.userId,
      filedBy: 'Petitioner',
    });
    addDocumentToCase(user, caseToAdd, odsDocumentEntity);
  }

  await applicationContext.getPersistenceGateway().saveCase({
    caseToSave: caseToAdd.validate().toRawObject(),
    applicationContext,
  });

  return new Case(caseToAdd).toRawObject();
};
