const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { DocketRecord } = require('../entities/DocketRecord');
const { Document } = require('../entities/Document');
const { Message } = require('../entities/Message');
const { PETITIONS_SECTION } = require('../entities/WorkQueue');
const { UnauthorizedError } = require('../../errors/errors');
const { User } = require('../entities/User');
const { WorkItem } = require('../entities/WorkItem');

const addPetitionDocumentToCase = ({
  applicationContext,
  caseToAdd,
  documentEntity,
  user,
}) => {
  const workItemEntity = new WorkItem(
    {
      assigneeId: null,
      assigneeName: null,
      caseId: caseToAdd.caseId,
      caseStatus: caseToAdd.status,
      caseTitle: Case.getCaseCaptionNames(Case.getCaseCaption(caseToAdd)),
      docketNumber: caseToAdd.docketNumber,
      docketNumberSuffix: caseToAdd.docketNumberSuffix,
      document: {
        ...documentEntity.toRawObject(),
        createdAt: documentEntity.createdAt,
      },
      isInitializeCase: documentEntity.isPetitionDocument() ? true : false,
      isQC: true,
      section: PETITIONS_SECTION,
      sentBy: user.userId,
    },
    { applicationContext },
  );

  let message;

  const caseCaptionNames = Case.getCaseCaptionNames(caseToAdd.caseCaption);
  message = `${documentEntity.documentType} filed by ${caseCaptionNames} is ready for review.`;

  workItemEntity.addMessage(
    new Message(
      {
        from: user.name,
        fromUserId: user.userId,
        message,
      },
      { applicationContext },
    ),
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

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.PETITION)) {
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
  if (user.role === User.ROLES.practitioner) {
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

  let partySecondary = false;
  if (
    petitionMetadata.contactSecondary &&
    petitionMetadata.contactSecondary.name
  ) {
    partySecondary = true;
  }

  const caseToAdd = new Case(
    {
      practitioners,
      userId: user.userId,
      ...petitionEntity.toRawObject(),
      docketNumber,
      isPaper: false,
    },
    {
      applicationContext,
    },
  );

  caseToAdd.caseCaption = Case.getCaseCaption(caseToAdd);

  const petitionDocumentEntity = new Document(
    {
      documentId: petitionFileId,
      documentType: Document.INITIAL_DOCUMENT_TYPES.petition.documentType,
      eventCode: Document.INITIAL_DOCUMENT_TYPES.petition.eventCode,
      partyPrimary: true,
      partySecondary,
      practitioner: practitioners[0],
      userId: user.userId,
      ...caseToAdd.getCaseContacts({
        contactPrimary: true,
        contactSecondary: true,
      }),
    },
    { applicationContext },
  );

  const newWorkItem = addPetitionDocumentToCase({
    applicationContext,
    caseToAdd,
    documentEntity: petitionDocumentEntity,
    user,
  });

  caseToAdd.addDocketRecord(
    new DocketRecord({
      description: `Request for Place of Trial at ${caseToAdd.preferredTrialCity}`,
      eventCode:
        Document.INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.eventCode,
      filingDate: caseToAdd.receivedAt || caseToAdd.createdAt,
    }),
  );

  const stinDocumentEntity = new Document(
    {
      documentId: stinFileId,
      documentType: Document.INITIAL_DOCUMENT_TYPES.stin.documentType,
      eventCode: Document.INITIAL_DOCUMENT_TYPES.stin.eventCode,
      partyPrimary: true,
      partySecondary,
      practitioner: practitioners[0],
      userId: user.userId,
      ...caseToAdd.getCaseContacts({
        contactPrimary: true,
        contactSecondary: true,
      }),
    },
    { applicationContext },
  );

  caseToAdd.addDocumentWithoutDocketRecord(stinDocumentEntity);

  if (ownershipDisclosureFileId) {
    const odsDocumentEntity = new Document(
      {
        documentId: ownershipDisclosureFileId,
        documentType:
          Document.INITIAL_DOCUMENT_TYPES.ownershipDisclosure.documentType,
        eventCode:
          Document.INITIAL_DOCUMENT_TYPES.ownershipDisclosure.eventCode,
        partyPrimary: true,
        partySecondary,
        practitioner: practitioners[0],
        userId: user.userId,
        ...caseToAdd.getCaseContacts({
          contactPrimary: true,
          contactSecondary: true,
        }),
      },
      { applicationContext },
    );

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

  return new Case(caseToAdd, { applicationContext }).toRawObject();
};
