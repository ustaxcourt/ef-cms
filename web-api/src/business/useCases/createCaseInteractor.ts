import { Case, CaseStatusChange } from '@shared/business/entities/cases/Case';
import {
  CreatedCaseType,
  INITIAL_DOCUMENT_TYPES,
  PETITIONS_SECTION,
  ROLES,
} from '@shared/business/entities/EntityConstants';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { ElectronicPetition } from '@shared/business/entities/cases/ElectronicPetition';
import { Petitioner } from '@shared/business/entities/contacts/Petitioner';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import {
  AuthUser,
  UnknownAuthUser,
} from '@shared/business/entities/authUser/AuthUser';
import { UserCase } from '@shared/business/entities/UserCase';
import { UserRecord } from '@web-api/persistence/dynamo/dynamoTypes';
import { WorkItem } from '@shared/business/entities/WorkItem';
import { createPetitionersOnCase } from '@web-api/persistence/postgres/cases/parties/createPetitionersOnCase';
import { createCaseStatistics } from '@web-api/persistence/postgres/cases/statistics/createCaseStatistics';
import { generateDocketNumber } from '@web-api/persistence/postgres/cases/generateDocketNumber';
import { setServiceIndicatorsForPetitionersOnCase } from '@shared/business/utilities/setServiceIndicatorsForPetitionersOnCase';
import { upsertWorkItems } from '@web-api/persistence/postgres/workitems/upsertWorkItems';
import { acquireLock } from '@web-api/business/useCaseHelper/acquireLock';
import { removeLock } from '@web-api/persistence/dynamo/locks/acquireLock';
import { upsertCaseStatusUpdates } from '@web-api/persistence/postgres/cases/upsertCaseStatusUpdates';
import { settlePromises } from '@web-api/utilities/settlePromises';

export type ElectronicCreatedCaseType = Omit<CreatedCaseType, 'trialCitiies'>;
export const CREATE_CASE_LOCK_IDENTIFIER = '11235';

const addPetitionDocketEntryToCase = ({
  caseToAdd,
  docketEntryEntity,
  user,
}) => {
  const workItemEntity = new WorkItem(
    {
      assigneeId: null,
      assigneeName: null,
      associatedJudge: caseToAdd.associatedJudge,
      associatedJudgeId: caseToAdd.associatedJudgeId,
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
      trialDate: caseToAdd.trialDate,
      trialLocation: caseToAdd.trialLocation,
    },
    { caseEntity: caseToAdd },
  );

  docketEntryEntity.setWorkItem(workItemEntity);
  caseToAdd.addDocketEntry(docketEntryEntity);

  return workItemEntity;
};

const createCaseMetadata = async (
  applicationContext: ServerApplicationContext,
  {
    attachmentToPetitionFileIds,
    corporateDisclosureFileId,
    petitionEntity,
    petitionFileId,
    petitionMetadata,
    privatePractitioners,
    stinFileId,
    user,
  }: {
    attachmentToPetitionFileIds?: string[];
    corporateDisclosureFileId?: string;
    petitionEntity: ElectronicPetition;
    petitionFileId: string;
    petitionMetadata: any;
    privatePractitioners: UserRecord[];
    stinFileId: string;
    user: UserRecord;
  },
  authorizedUser: AuthUser,
) => {
  const docketNumber = await generateDocketNumber({});

  const caseToAdd = new Case(
    {
      docketNumber,
      isPaper: false,
      orderForFilingFee: true,
      ...petitionEntity.toRawObject(),
      privatePractitioners,
    },
    {
      authorizedUser,
      isNewCase: true,
    },
  );

  setServiceIndicatorsForPetitionersOnCase(caseToAdd);

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
      redactionAcknowledgement: petitionEntity.petitionRedactionAcknowledgement,
    },
    { authorizedUser, petitioners: caseToAdd.petitioners },
  );

  petitionDocketEntryEntity.setFiledBy(user);

  const newWorkItem = addPetitionDocketEntryToCase({
    caseToAdd,
    docketEntryEntity: petitionDocketEntryEntity,
    user,
  });

  const requestPlaceOfTrialDocketEntry = new DocketEntry(
    {
      documentTitle: `Request for Place of Trial at ${caseToAdd.preferredTrialCity}`,
      documentType: INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.documentType,
      eventCode: INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.eventCode,
      filingDate: caseToAdd.createdAt,
      isFileAttached: false,
      isOnDocketRecord: true,
      processingStatus: 'complete',
    },
    {
      authorizedUser,
      petitioners: caseToAdd.petitioners,
    },
  );

  requestPlaceOfTrialDocketEntry.setFiledBy(user);

  caseToAdd.addDocketEntry(requestPlaceOfTrialDocketEntry);

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
    },
    { authorizedUser, petitioners: caseToAdd.petitioners },
  );

  stinDocketEntryEntity.setFiledBy(user);

  caseToAdd.addDocketEntry(stinDocketEntryEntity);

  if (corporateDisclosureFileId) {
    const cdsDocketEntryEntity = new DocketEntry(
      {
        contactPrimary: caseToAdd.getContactPrimary(),
        contactSecondary: caseToAdd.getContactSecondary(),
        docketEntryId: corporateDisclosureFileId,
        documentTitle: INITIAL_DOCUMENT_TYPES.corporateDisclosure.documentType,
        documentType: INITIAL_DOCUMENT_TYPES.corporateDisclosure.documentType,
        eventCode: INITIAL_DOCUMENT_TYPES.corporateDisclosure.eventCode,
        filers,
        filingDate: caseToAdd.createdAt,
        isFileAttached: true,
        isOnDocketRecord: true,
        privatePractitioners,
      },
      { authorizedUser, petitioners: caseToAdd.petitioners },
    );

    cdsDocketEntryEntity.setFiledBy(user);

    caseToAdd.addDocketEntry(cdsDocketEntryEntity);
  }

  if (attachmentToPetitionFileIds?.length) {
    attachmentToPetitionFileIds.forEach((atpFileId, index) => {
      const atpDocketEntryEntity = new DocketEntry(
        {
          caseType:
            petitionMetadata.hasIrsNotice &&
            petitionMetadata.irsNotices?.[index]?.caseType,
          contactPrimary: caseToAdd.getContactPrimary(),
          contactSecondary: caseToAdd.getContactSecondary(),
          docketEntryId: atpFileId,
          documentTitle:
            INITIAL_DOCUMENT_TYPES.attachmentToPetition.documentType,
          documentType:
            INITIAL_DOCUMENT_TYPES.attachmentToPetition.documentType,
          eventCode: INITIAL_DOCUMENT_TYPES.attachmentToPetition.eventCode,
          filers,
          filingDate: caseToAdd.createdAt,
          isFileAttached: true,
          isOnDocketRecord: true,
          noticeIssuedDate:
            petitionMetadata.hasIrsNotice &&
            petitionMetadata.irsNotices?.[index]?.noticeIssuedDate,
          privatePractitioners,
          redactionAcknowledgement:
            petitionEntity.irsNoticesRedactionAcknowledgement,
          taxYear:
            petitionMetadata.hasIrsNotice &&
            petitionMetadata.irsNotices?.[index]?.taxYear,
        },
        { authorizedUser, petitioners: caseToAdd.petitioners },
      );

      atpDocketEntryEntity.setFiledBy(user);

      caseToAdd.addDocketEntry(atpDocketEntryEntity);
    });
  }

  await applicationContext.getUseCaseHelpers().createCaseAndAssociations({
    applicationContext,
    authorizedUser,
    caseToCreate: caseToAdd.validate().toRawObject(),
  });

  return { caseToAdd, workItem: newWorkItem };
};

export const createCaseInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    attachmentToPetitionFileIds,
    corporateDisclosureFileId,
    petitionFileId,
    petitionMetadata,
    stinFileId,
  }: {
    attachmentToPetitionFileIds?: string[];
    corporateDisclosureFileId?: string;
    petitionFileId: string;
    petitionMetadata: any;
    stinFileId: string;
  },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.PETITION)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  const petitionEntity = new ElectronicPetition(petitionMetadata).validate();

  let privatePractitioners: UserRecord[] = [];
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

    // remove the email from contactPrimary
    // since the practitioners array should have a service email
    // and paperPetitionEmail is used as email for the petitioner
    delete petitionEntity.getContactPrimary().email;
    delete petitionEntity.getContactPrimary().serviceIndicator;

    privatePractitioners = [practitionerUser];
  }

  await acquireLock({
    applicationContext,
    authorizedUser,
    identifiers: [CREATE_CASE_LOCK_IDENTIFIER],
    retries: 10,
    waitTime: 500,
  });

  let caseToAdd: Case;
  let workItem: WorkItem;

  try {
    ({ caseToAdd, workItem } = await createCaseMetadata(
      applicationContext,
      {
        attachmentToPetitionFileIds,
        corporateDisclosureFileId,
        petitionEntity,
        petitionFileId,
        petitionMetadata,
        privatePractitioners,
        stinFileId,
        user,
      },
      authorizedUser,
    ));
  } finally {
    await removeLock({
      applicationContext,
      identifiers: [CREATE_CASE_LOCK_IDENTIFIER],
    });
  }

  const userCaseEntity = new UserCase(caseToAdd);

  const caseAssociationUpdates = [
    createPetitionersOnCase({
      docketNumber: caseToAdd.docketNumber,
      petitioners: caseToAdd.petitioners.map(p => new Petitioner(p)),
    }),
    upsertCaseStatusUpdates({
      docketNumber: caseToAdd.docketNumber,
      statusUpdates: caseToAdd.caseStatusHistory as CaseStatusChange[],
    }),
    upsertWorkItems({
      workItems: [workItem.validate().toRawObject()],
    }),
    createCaseStatistics({
      docketNumber: caseToAdd.docketNumber,
      statistics: caseToAdd.statistics || [],
    }),
    applicationContext.getPersistenceGateway().associateUserWithCase({
      applicationContext,
      docketNumber: caseToAdd.docketNumber,
      userCase: userCaseEntity.validate().toRawObject(),
      userId: user.userId,
    }),
  ];

  await settlePromises(caseAssociationUpdates, {
    errorMessage: `Failed to finish creating case associations for ${caseToAdd.docketNumber}`,
  });

  applicationContext.logger.info('filed a new petition', {
    docketNumber: caseToAdd.docketNumber,
  });

  return new Case(caseToAdd, { authorizedUser }).toRawObject();
};
