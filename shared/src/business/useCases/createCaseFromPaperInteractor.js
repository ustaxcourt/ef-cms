const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { CaseInternal } = require('../entities/cases/CaseInternal');
const { DocketEntry } = require('../entities/DocketEntry');
const { INITIAL_DOCUMENT_TYPES } = require('../entities/EntityConstants');
const { replaceBracketed } = require('../utilities/replaceBracketed');
const { UnauthorizedError } = require('../../errors/errors');
const { WorkItem } = require('../entities/WorkItem');

const addPetitionDocketEntryWithWorkItemToCase = ({
  applicationContext,
  caseToAdd,
  docketEntryEntity,
  user,
}) => {
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
        ...docketEntryEntity.toRawObject(),
        createdAt: docketEntryEntity.createdAt,
      },
      isInitializeCase: true,
      section: user.section,
      sentBy: user.name,
      sentBySection: user.section,
      sentByUserId: user.userId,
    },
    { applicationContext },
  );

  docketEntryEntity.setWorkItem(workItemEntity);
  caseToAdd.addDocketEntry(docketEntryEntity);

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

  const petitionDocketEntryEntity = new DocketEntry(
    {
      createdAt: caseToAdd.receivedAt,
      description: INITIAL_DOCUMENT_TYPES.petition.documentType,
      documentId: petitionFileId,
      documentType: INITIAL_DOCUMENT_TYPES.petition.documentType,
      eventCode: INITIAL_DOCUMENT_TYPES.petition.eventCode,
      filingDate: caseToAdd.receivedAt,
      isFileAttached: true,
      isOnDocketRecord: true,
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

  const { workItem: newWorkItem } = addPetitionDocketEntryWithWorkItemToCase({
    applicationContext,
    caseToAdd,
    docketEntryEntity: petitionDocketEntryEntity,
    user,
  });

  if (applicationForWaiverOfFilingFeeFileId) {
    let {
      documentTitle,
    } = INITIAL_DOCUMENT_TYPES.applicationForWaiverOfFilingFee;

    const applicationForWaiverOfFilingFeeDocketEntryEntity = new DocketEntry(
      {
        createdAt: caseToAdd.receivedAt,
        description:
          INITIAL_DOCUMENT_TYPES.applicationForWaiverOfFilingFee.documentType,
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

    caseToAdd.addDocketEntry(applicationForWaiverOfFilingFeeDocketEntryEntity);
  }

  if (requestForPlaceOfTrialFileId) {
    let { documentTitle } = INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial;
    if (caseToAdd.preferredTrialCity) {
      documentTitle = replaceBracketed(
        documentTitle,
        caseToAdd.preferredTrialCity,
      );
    }

    const requestForPlaceOfTrialDocketEntryEntity = new DocketEntry(
      {
        createdAt: caseToAdd.receivedAt,
        description: INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.documentType,
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

    caseToAdd.addDocketEntry(requestForPlaceOfTrialDocketEntryEntity);
  }

  if (stinFileId) {
    const stinDocketEntryEntity = new DocketEntry(
      {
        createdAt: caseToAdd.receivedAt,
        description: INITIAL_DOCUMENT_TYPES.stin.documentType,
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

    caseToAdd.addDocketEntry(stinDocketEntryEntity);
  }

  if (ownershipDisclosureFileId) {
    const odsDocketEntryEntity = new DocketEntry(
      {
        createdAt: caseToAdd.receivedAt,
        description: INITIAL_DOCUMENT_TYPES.ownershipDisclosure.documentType,
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

    caseToAdd.addDocketEntry(odsDocketEntryEntity);
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
