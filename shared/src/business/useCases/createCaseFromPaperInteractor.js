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
      docketEntry: {
        ...docketEntryEntity.toRawObject(),
        createdAt: docketEntryEntity.createdAt,
      },
      docketNumber: caseToAdd.docketNumber,
      docketNumberWithSuffix: caseToAdd.docketNumberWithSuffix,
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
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.ownershipDisclosureFileId the id of the ownership disclosure file
 * @param {string} providers.petitionFileId the id of the petition file
 * @param {string} providers.petitionMetadata the petition metadata
 * @param {string} providers.requestForPlaceOfTrialFileId the id of the request for place of trial file
 * @param {string} providers.stinFileId the id of the stin file
 * @returns {object} the created case
 */
exports.createCaseFromPaperInteractor = async (
  applicationContext,
  {
    applicationForWaiverOfFilingFeeFileId,
    ownershipDisclosureFileId,
    petitionFileId,
    petitionMetadata,
    requestForPlaceOfTrialFileId,
    stinFileId,
  },
) => {
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
  const docketNumber =
    await applicationContext.docketNumberGenerator.createDocketNumber({
      applicationContext,
      receivedAt: petitionMetadata.receivedAt,
    });

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

  const filers = [caseToAdd.getContactPrimary().contactId];

  if (
    petitionMetadata.contactSecondary &&
    petitionMetadata.contactSecondary.name
  ) {
    filers.push(caseToAdd.getContactSecondary().contactId);
  }

  const petitionDocketEntryEntity = new DocketEntry(
    {
      createdAt: caseToAdd.receivedAt,
      docketEntryId: petitionFileId,
      documentTitle: INITIAL_DOCUMENT_TYPES.petition.documentType,
      documentType: INITIAL_DOCUMENT_TYPES.petition.documentType,
      eventCode: INITIAL_DOCUMENT_TYPES.petition.eventCode,
      filers,
      filingDate: caseToAdd.receivedAt,
      isFileAttached: true,
      isOnDocketRecord: true,
      isPaper: true,
      mailingDate: petitionEntity.mailingDate,
      receivedAt: caseToAdd.receivedAt,
      userId: user.userId,
    },
    { applicationContext, petitioners: caseToAdd.petitioners },
  );

  const { workItem: newWorkItem } = addPetitionDocketEntryWithWorkItemToCase({
    applicationContext,
    caseToAdd,
    docketEntryEntity: petitionDocketEntryEntity,
    user,
  });

  if (applicationForWaiverOfFilingFeeFileId) {
    let { documentTitle } =
      INITIAL_DOCUMENT_TYPES.applicationForWaiverOfFilingFee;

    const applicationForWaiverOfFilingFeeDocketEntryEntity = new DocketEntry(
      {
        createdAt: caseToAdd.receivedAt,
        docketEntryId: applicationForWaiverOfFilingFeeFileId,
        documentTitle,
        documentType:
          INITIAL_DOCUMENT_TYPES.applicationForWaiverOfFilingFee.documentType,
        eventCode:
          INITIAL_DOCUMENT_TYPES.applicationForWaiverOfFilingFee.eventCode,
        filers,
        filingDate: caseToAdd.receivedAt,
        isFileAttached: true,
        isPaper: true,
        mailingDate: petitionEntity.mailingDate,
        receivedAt: caseToAdd.receivedAt,
        userId: user.userId,
      },
      { applicationContext, petitioners: caseToAdd.petitioners },
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
        docketEntryId: requestForPlaceOfTrialFileId,
        documentTitle,
        documentType:
          INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.documentType,
        eventCode: INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.eventCode,
        filers,
        filingDate: caseToAdd.receivedAt,
        isFileAttached: true,
        isPaper: true,
        mailingDate: petitionEntity.mailingDate,
        receivedAt: caseToAdd.receivedAt,
        userId: user.userId,
      },
      { applicationContext, petitioners: caseToAdd.petitioners },
    );

    caseToAdd.addDocketEntry(requestForPlaceOfTrialDocketEntryEntity);
  }

  if (stinFileId) {
    const stinDocketEntryEntity = new DocketEntry(
      {
        createdAt: caseToAdd.receivedAt,
        docketEntryId: stinFileId,
        documentTitle: INITIAL_DOCUMENT_TYPES.stin.documentType,
        documentType: INITIAL_DOCUMENT_TYPES.stin.documentType,
        eventCode: INITIAL_DOCUMENT_TYPES.stin.eventCode,
        filers,
        filingDate: caseToAdd.receivedAt,
        index: 0,
        isFileAttached: true,
        isPaper: true,
        mailingDate: petitionEntity.mailingDate,
        receivedAt: caseToAdd.receivedAt,
        userId: user.userId,
      },
      { applicationContext, petitioners: caseToAdd.petitioners },
    );

    caseToAdd.addDocketEntry(stinDocketEntryEntity);
  }

  if (ownershipDisclosureFileId) {
    const odsDocketEntryEntity = new DocketEntry(
      {
        createdAt: caseToAdd.receivedAt,
        docketEntryId: ownershipDisclosureFileId,
        documentTitle: INITIAL_DOCUMENT_TYPES.ownershipDisclosure.documentType,
        documentType: INITIAL_DOCUMENT_TYPES.ownershipDisclosure.documentType,
        eventCode: INITIAL_DOCUMENT_TYPES.ownershipDisclosure.eventCode,
        filers,
        filingDate: caseToAdd.receivedAt,
        isFileAttached: true,
        isPaper: true,
        mailingDate: petitionEntity.mailingDate,
        receivedAt: caseToAdd.receivedAt,
        userId: user.userId,
      },
      { applicationContext, petitioners: caseToAdd.petitioners },
    );

    caseToAdd.addDocketEntry(odsDocketEntryEntity);
  }

  await Promise.all([
    applicationContext.getUseCaseHelpers().createCaseAndAssociations({
      applicationContext,
      caseToCreate: caseToAdd.validate().toRawObject(),
    }),
    applicationContext.getPersistenceGateway().saveWorkItem({
      applicationContext,
      workItem: newWorkItem.validate().toRawObject(),
    }),
  ]);

  return new Case(caseToAdd, { applicationContext }).toRawObject();
};
