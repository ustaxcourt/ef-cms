import { Case } from '../../../../shared/src/business/entities/cases/Case';
import {
  CreatedCaseType,
  INITIAL_DOCUMENT_TYPES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { DocketEntry } from '../../../../shared/src/business/entities/DocketEntry';
import { PaperPetition } from '../../../../shared/src/business/entities/cases/PaperPetition';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../shared/src/authorization/authorizationClientService';
import { RawUser } from '@shared/business/entities/User';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '../../errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { WorkItem } from '../../../../shared/src/business/entities/WorkItem';
import { replaceBracketed } from '../../../../shared/src/business/utilities/replaceBracketed';

const addPetitionDocketEntryWithWorkItemToCase = ({
  caseToAdd,
  docketEntryEntity,
  user,
}: {
  caseToAdd: Case;
  docketEntryEntity: DocketEntry;
  user: RawUser;
}): {
  workItem: WorkItem;
} => {
  const workItemEntity = new WorkItem(
    {
      assigneeId: user.userId,
      assigneeName: user.name,
      associatedJudge: caseToAdd.associatedJudge,
      associatedJudgeId: caseToAdd.associatedJudgeId,
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
      trialDate: caseToAdd.trialDate,
      trialLocation: caseToAdd.trialLocation,
    },
    { caseEntity: caseToAdd },
  );

  docketEntryEntity.setWorkItem(workItemEntity);
  caseToAdd.addDocketEntry(docketEntryEntity);

  return {
    workItem: workItemEntity,
  };
};

export const createCaseFromPaperInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    applicationForWaiverOfFilingFeeFileId,
    attachmentToPetitionFileId,
    corporateDisclosureFileId,
    petitionFileId,
    petitionMetadata,
    requestForPlaceOfTrialFileId,
    stinFileId,
  }: {
    applicationForWaiverOfFilingFeeFileId?: string;
    attachmentToPetitionFileId?: string;
    corporateDisclosureFileId?: string;
    petitionFileId: string;
    petitionMetadata: CreatedCaseType;
    requestForPlaceOfTrialFileId?: string;
    stinFileId?: string;
  },
  authorizedUser: UnknownAuthUser,
): Promise<RawCase> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.START_PAPER_CASE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  const petitionEntity = new PaperPetition(petitionMetadata, {
    authorizedUser,
  }).validate();

  const docketNumber =
    await applicationContext.docketNumberGenerator.createDocketNumber({
      applicationContext,
      receivedAt: petitionMetadata.receivedAt,
    });

  const caseToAdd = new Case(
    {
      docketNumber,
      ...petitionEntity.toRawObject(),
      isPaper: true,
      status: petitionMetadata.status || null,
      userId: user.userId,
    },
    {
      authorizedUser,
      isNewCase: true,
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
    },
    { authorizedUser, petitioners: caseToAdd.petitioners },
  );

  petitionDocketEntryEntity.setFiledBy(user);

  const { workItem: newWorkItem } = addPetitionDocketEntryWithWorkItemToCase({
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
      },
      { authorizedUser, petitioners: caseToAdd.petitioners },
    );

    applicationForWaiverOfFilingFeeDocketEntryEntity.setFiledBy(user);

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
      },
      { authorizedUser, petitioners: caseToAdd.petitioners },
    );

    requestForPlaceOfTrialDocketEntryEntity.setFiledBy(user);

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
      },
      { authorizedUser, petitioners: caseToAdd.petitioners },
    );

    stinDocketEntryEntity.setFiledBy(user);

    caseToAdd.addDocketEntry(stinDocketEntryEntity);
  }

  if (corporateDisclosureFileId) {
    const cdsDocketEntryEntity = new DocketEntry(
      {
        createdAt: caseToAdd.receivedAt,
        docketEntryId: corporateDisclosureFileId,
        documentTitle: INITIAL_DOCUMENT_TYPES.corporateDisclosure.documentType,
        documentType: INITIAL_DOCUMENT_TYPES.corporateDisclosure.documentType,
        eventCode: INITIAL_DOCUMENT_TYPES.corporateDisclosure.eventCode,
        filers,
        filingDate: caseToAdd.receivedAt,
        isFileAttached: true,
        isPaper: true,
        mailingDate: petitionEntity.mailingDate,
        receivedAt: caseToAdd.receivedAt,
      },
      { authorizedUser, petitioners: caseToAdd.petitioners },
    );

    cdsDocketEntryEntity.setFiledBy(user);

    caseToAdd.addDocketEntry(cdsDocketEntryEntity);
  }

  if (attachmentToPetitionFileId) {
    const atpDocketEntryEntity = new DocketEntry(
      {
        createdAt: caseToAdd.receivedAt,
        docketEntryId: attachmentToPetitionFileId,
        documentTitle: INITIAL_DOCUMENT_TYPES.attachmentToPetition.documentType,
        documentType: INITIAL_DOCUMENT_TYPES.attachmentToPetition.documentType,
        eventCode: INITIAL_DOCUMENT_TYPES.attachmentToPetition.eventCode,
        filers,
        filingDate: caseToAdd.receivedAt,
        isFileAttached: true,
        isOnDocketRecord: true,
        isPaper: true,
        mailingDate: petitionEntity.mailingDate,
        receivedAt: caseToAdd.receivedAt,
      },
      { authorizedUser, petitioners: caseToAdd.petitioners },
    );

    atpDocketEntryEntity.setFiledBy(user);

    caseToAdd.addDocketEntry(atpDocketEntryEntity);
  }

  await Promise.all([
    applicationContext.getUseCaseHelpers().createCaseAndAssociations({
      applicationContext,
      authorizedUser,
      caseToCreate: caseToAdd.validate().toRawObject(),
    }),
    applicationContext.getPersistenceGateway().saveWorkItem({
      applicationContext,
      workItem: newWorkItem.validate().toRawObject(),
    }),
  ]);

  return new Case(caseToAdd, { authorizedUser }).toRawObject();
};
