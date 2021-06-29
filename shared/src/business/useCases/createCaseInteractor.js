const {
  CaseExternalIncomplete,
} = require('../entities/cases/CaseExternalIncomplete');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const {
  setServiceIndicatorsForCase,
} = require('../utilities/setServiceIndicatorsForCase');
const { Case } = require('../entities/cases/Case');
const { DocketEntry } = require('../entities/DocketEntry');
const { INITIAL_DOCUMENT_TYPES } = require('../entities/EntityConstants');
const { PETITIONS_SECTION } = require('../entities/EntityConstants');
const { ROLES } = require('../entities/EntityConstants');
const { UnauthorizedError } = require('../../errors/errors');
const { UserCase } = require('../entities/UserCase');
const { WorkItem } = require('../entities/WorkItem');

const addPetitionDocketEntryToCase = ({
  applicationContext,
  caseToAdd,
  docketEntryEntity,
  user,
}) => {
  const workItemEntity = new WorkItem(
    {
      assigneeId: null,
      assigneeName: null,
      associatedJudge: caseToAdd.associatedJudge,
      caseIsInProgress: caseToAdd.inProgress,
      caseStatus: caseToAdd.status,
      caseTitle: Case.getCaseTitle(Case.getCaseCaption(caseToAdd)),
      docketEntry: {
        ...docketEntryEntity.toRawObject(),
        createdAt: docketEntryEntity.createdAt,
      },
      docketNumber: caseToAdd.docketNumber,
      docketNumberWithSuffix: caseToAdd.docketNumberWithSuffix,
      isInitializeCase: true,
      section: PETITIONS_SECTION,
      sentBy: user.name,
      sentByUserId: user.userId,
    },
    { applicationContext },
  );

  docketEntryEntity.setWorkItem(workItemEntity);
  caseToAdd.addDocketEntry(docketEntryEntity);

  return workItemEntity;
};

/**
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.ownershipDisclosureFileId the id of the ownership disclosure file
 * @param {string} providers.petitionFileId the id of the petition file
 * @param {object} providers.petitionMetadata the petition metadata
 * @param {string} providers.stinFileId the id of the stin file
 * @returns {object} the created case
 */
exports.createCaseInteractor = async (
  applicationContext,
  { ownershipDisclosureFileId, petitionFileId, petitionMetadata, stinFileId },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.PETITION)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  const petitionEntity = new CaseExternalIncomplete(petitionMetadata, {
    applicationContext,
  }).validate();

  const updatedCaseWithServiceIndicators =
    setServiceIndicatorsForCase(petitionEntity);

  petitionEntity.petitioners = updatedCaseWithServiceIndicators.petitioners;

  const docketNumber =
    await applicationContext.docketNumberGenerator.createDocketNumber({
      applicationContext,
    });

  let privatePractitioners = [];
  if (user.role === ROLES.privatePractitioner) {
    const practitionerUser = await applicationContext
      .getPersistenceGateway()
      .getUserById({
        applicationContext,
        userId: user.userId,
      });

    practitionerUser.representing = [
      petitionEntity.getContactPrimary().contactId,
    ];

    if (
      petitionMetadata.contactSecondary &&
      petitionMetadata.contactSecondary.name
    ) {
      practitionerUser.representing.push(
        petitionEntity.getContactSecondary().contactId,
      );
    }

    // remove the email from contactPrimary since the practitioners array should have a service email
    delete petitionEntity.getContactPrimary().email;

    privatePractitioners = [practitionerUser];
  }

  const caseToAdd = new Case(
    {
      docketNumber,
      isPaper: false,
      orderForFilingFee: true,
      ...petitionEntity.toRawObject(),
      privatePractitioners,
    },
    {
      applicationContext,
    },
  );

  if (user.role === ROLES.petitioner) {
    caseToAdd.getContactPrimary().contactId = user.userId;
  }

  caseToAdd.caseCaption = Case.getCaseCaption(caseToAdd);
  caseToAdd.initialCaption = caseToAdd.caseCaption;

  const filers = [caseToAdd.getContactPrimary().contactId];

  if (
    petitionMetadata.contactSecondary &&
    petitionMetadata.contactSecondary.name
  ) {
    filers.push(caseToAdd.getContactSecondary().contactId);
  }

  const petitionDocketEntryEntity = new DocketEntry(
    {
      contactPrimary: caseToAdd.getContactPrimary(),
      contactSecondary: caseToAdd.getContactSecondary(),
      docketEntryId: petitionFileId,
      documentTitle: INITIAL_DOCUMENT_TYPES.petition.documentType,
      documentType: INITIAL_DOCUMENT_TYPES.petition.documentType,
      eventCode: INITIAL_DOCUMENT_TYPES.petition.eventCode,
      filers,
      filingDate: caseToAdd.createdAt,
      isFileAttached: true,
      isOnDocketRecord: true,
      privatePractitioners,
      userId: user.userId,
    },
    { applicationContext, petitioners: caseToAdd.petitioners },
  );

  const newWorkItem = addPetitionDocketEntryToCase({
    applicationContext,
    caseToAdd,
    docketEntryEntity: petitionDocketEntryEntity,
    user,
  });

  caseToAdd.addDocketEntry(
    new DocketEntry(
      {
        documentTitle: `Request for Place of Trial at ${caseToAdd.preferredTrialCity}`,
        documentType:
          INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.documentType,
        eventCode: INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.eventCode,
        filingDate: caseToAdd.createdAt,
        isFileAttached: false,
        isMinuteEntry: true,
        isOnDocketRecord: true,
        processingStatus: 'complete',
        userId: user.userId,
      },
      { applicationContext, petitioners: caseToAdd.petitioners },
    ),
  );

  const stinDocketEntryEntity = new DocketEntry(
    {
      contactPrimary: caseToAdd.getContactPrimary(),
      contactSecondary: caseToAdd.getContactSecondary(),
      docketEntryId: stinFileId,
      documentTitle: INITIAL_DOCUMENT_TYPES.stin.documentType,
      documentType: INITIAL_DOCUMENT_TYPES.stin.documentType,
      eventCode: INITIAL_DOCUMENT_TYPES.stin.eventCode,
      filers,
      filingDate: caseToAdd.createdAt,
      index: 0,
      isFileAttached: true,
      privatePractitioners,
      userId: user.userId,
    },
    { applicationContext, petitioners: caseToAdd.petitioners },
  );

  caseToAdd.addDocketEntry(stinDocketEntryEntity);

  if (ownershipDisclosureFileId) {
    const odsDocketEntryEntity = new DocketEntry(
      {
        contactPrimary: caseToAdd.getContactPrimary(),
        contactSecondary: caseToAdd.getContactSecondary(),
        docketEntryId: ownershipDisclosureFileId,
        documentTitle: INITIAL_DOCUMENT_TYPES.ownershipDisclosure.documentType,
        documentType: INITIAL_DOCUMENT_TYPES.ownershipDisclosure.documentType,
        eventCode: INITIAL_DOCUMENT_TYPES.ownershipDisclosure.eventCode,
        filers,
        filingDate: caseToAdd.createdAt,
        isFileAttached: true,
        isOnDocketRecord: true,
        privatePractitioners,
        userId: user.userId,
      },
      { applicationContext, petitioners: caseToAdd.petitioners },
    );

    caseToAdd.addDocketEntry(odsDocketEntryEntity);
  }

  await applicationContext.getUseCaseHelpers().createCaseAndAssociations({
    applicationContext,
    caseToCreate: caseToAdd.validate().toRawObject(),
  });

  const userCaseEntity = new UserCase(caseToAdd);

  await applicationContext.getPersistenceGateway().associateUserWithCase({
    applicationContext,
    docketNumber: caseToAdd.docketNumber,
    userCase: userCaseEntity.validate().toRawObject(),
    userId: user.userId,
  });

  await applicationContext.getPersistenceGateway().saveWorkItem({
    applicationContext,
    workItem: newWorkItem.validate().toRawObject(),
  });

  applicationContext.logger.info('filed a new petition', {
    docketNumber: caseToAdd.docketNumber,
  });

  return new Case(caseToAdd, { applicationContext }).toRawObject();
};
