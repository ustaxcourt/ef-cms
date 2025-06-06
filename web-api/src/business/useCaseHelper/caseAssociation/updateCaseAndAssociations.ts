import { Case } from '@shared/business/entities/cases/Case';
import { CaseDeadline } from '@shared/business/entities/CaseDeadline';
import { Correspondence } from '@shared/business/entities/Correspondence';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { IrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { Message } from '@shared/business/entities/Message';
import { PrivatePractitioner } from '@shared/business/entities/PrivatePractitioner';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { WorkItem } from '@shared/business/entities/WorkItem';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getMessagesByDocketNumber } from '@web-api/persistence/postgres/messages/getMessagesByDocketNumber';
import { getWorkItemsByDocketNumber } from '@web-api/persistence/postgres/workitems/getWorkItemsByDocketNumber';
import { updateMessage } from '@web-api/persistence/postgres/messages/updateMessage';
import { getCaseDeadlinesByDocketNumber } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByDocketNumber';
import { isEmpty } from 'lodash';
import { upsertCaseCorrespondences } from '@web-api/persistence/postgres/caseCorrespondences/upsertCaseCorrespondences';
import { upsertCaseDeadlines } from '@web-api/persistence/postgres/caseDeadlines/upsertCaseDeadlines';
import { upsertWorkItems } from '@web-api/persistence/postgres/workitems/upsertWorkItems';
import diff from 'diff-arrays-of-objects';
import { settlePromises } from '@web-api/utilities/settlePromises';
import { upsertCases } from '@web-api/persistence/postgres/cases/upsertCases';

// Because we used to rely on Dynamo, we needed to manually maintain relations in app code.
// In the future, it would be good to avoid doing so by leveraging SQL more effectively.
export const updateCaseAndAssociations = async ({
  applicationContext,
  authorizedUser,
  caseToUpdate,
  includeCorrespondenceAndWorkItems = true,
}: {
  applicationContext: ServerApplicationContext;
  authorizedUser: UnknownAuthUser;
  caseToUpdate: any;
  includeCorrespondenceAndWorkItems?: boolean;
}): Promise<RawCase> => {
  // Validate the old (pre-update) and new (post-update) case entity
  const newCaseEntity: Case = caseToUpdate.validate
    ? caseToUpdate
    : new Case(caseToUpdate, {
        authorizedUser,
      });

  const oldCaseEntity = await getCaseByDocketNumber({
    applicationContext,
    docketNumber: caseToUpdate.docketNumber,
  });

  const validNewRawCaseEntity = newCaseEntity.validate().toRawObject();

  const validRawOldCaseEntity = new Case(oldCaseEntity, {
    authorizedUser,
  })
    .validate()
    .toRawObject();

  // Get the data that needs deleted or updated
  const [
    deadlines,
    docketEntries,
    messages,
    deletedHearings,
    { irsPractitionersToDelete, irsPractitionersToUpdate },
    { privatePractitionersToDelete, privatePractitionersToUpdate },
    workItems,
    correspondences,
  ] = await Promise.all([
    getCaseDeadlinesToUpdate({
      caseToUpdate: validNewRawCaseEntity,
      oldCase: validRawOldCaseEntity,
    }),
    getDocketEntriesToUpdate({
      authorizedUser,
      caseToUpdate: validNewRawCaseEntity,
      oldCase: validRawOldCaseEntity,
    }),
    getMessagesToUpdate({
      caseToUpdate: validNewRawCaseEntity,
      oldCase: validRawOldCaseEntity,
    }),
    getHearingsToDelete({
      caseToUpdate: validNewRawCaseEntity,
      oldCase: validRawOldCaseEntity,
    }),
    getIrsPractitionersToDeleteAndUpdate({
      caseToUpdate: validNewRawCaseEntity,
      oldCase: validRawOldCaseEntity,
    }),
    getPrivatePractitionersToDeleteAndUpdate({
      caseToUpdate: validNewRawCaseEntity,
      oldCase: validRawOldCaseEntity,
    }),
    includeCorrespondenceAndWorkItems
      ? getWorkItemsToUpdate({
          caseToUpdate: validNewRawCaseEntity,
          oldCase: validRawOldCaseEntity,
        })
      : Promise.resolve([]),
    includeCorrespondenceAndWorkItems
      ? getCorrespondencesToUpdate({
          caseToUpdate: validNewRawCaseEntity,
          oldCase: validRawOldCaseEntity,
        })
      : Promise.resolve([]),
  ]);

  // Persist primary case data first to ensure no errors
  await upsertCases([validNewRawCaseEntity]);

  // Then persist all related case data
  await settlePromises([
    ...docketEntries.map(doc =>
      applicationContext.getPersistenceGateway().updateDocketEntry({
        applicationContext,
        docketEntryId: doc.docketEntryId,
        docketNumber: caseToUpdate.docketNumber,
        document: doc,
      }),
    ),
    ...messages.map(message => updateMessage(message)),
    upsertCaseCorrespondences(correspondences),
    ...deletedHearings.map(({ trialSessionId }) =>
      applicationContext.getPersistenceGateway().removeCaseFromHearing({
        applicationContext,
        docketNumber: caseToUpdate.docketNumber,
        trialSessionId,
      }),
    ),
    ...irsPractitionersToDelete.map(practitioner =>
      applicationContext.getPersistenceGateway().removeIrsPractitionerOnCase({
        applicationContext,
        docketNumber: caseToUpdate.docketNumber,
        userId: practitioner.userId,
      }),
    ),
    ...irsPractitionersToUpdate.map(practitioner =>
      applicationContext.getPersistenceGateway().updateIrsPractitionerOnCase({
        applicationContext,
        docketNumber: caseToUpdate.docketNumber,
        leadDocketNumber: caseToUpdate.leadDocketNumber,
        practitioner,
        userId: practitioner.userId,
      }),
    ),
    ...privatePractitionersToDelete.map(practitioner =>
      applicationContext
        .getPersistenceGateway()
        .removePrivatePractitionerOnCase({
          applicationContext,
          docketNumber: caseToUpdate.docketNumber,
          userId: practitioner.userId,
        }),
    ),
    ...privatePractitionersToUpdate.map(practitioner =>
      applicationContext
        .getPersistenceGateway()
        .updatePrivatePractitionerOnCase({
          applicationContext,
          docketNumber: caseToUpdate.docketNumber,
          leadDocketNumber: caseToUpdate.leadDocketNumber,
          // @ts-ignore
          practitioner,
          userId: practitioner.userId,
        }),
    ),
    upsertWorkItems({ workItems }),
    upsertCaseDeadlines(deadlines),
  ]);

  return validNewRawCaseEntity;
};

const getDocketEntriesToUpdate = ({
  authorizedUser,
  caseToUpdate,
  oldCase,
}: {
  authorizedUser: UnknownAuthUser;
  caseToUpdate: RawCase;
  oldCase: RawCase;
}) => {
  const { added: addedDocketEntries, updated: updatedDocketEntries } = diff(
    oldCase.docketEntries,
    caseToUpdate.docketEntries,
    'docketEntryId',
  );

  const {
    added: addedArchivedDocketEntries,
    updated: updatedArchivedDocketEntries,
  } = diff(
    oldCase.archivedDocketEntries,
    caseToUpdate.archivedDocketEntries,
    'docketEntryId',
  );

  const validDocketEntries = DocketEntry.validateRawCollection(
    [
      ...addedDocketEntries,
      ...updatedDocketEntries,
      ...addedArchivedDocketEntries,
      ...updatedArchivedDocketEntries,
    ],
    { authorizedUser, petitioners: caseToUpdate.petitioners },
  );

  return validDocketEntries;
};

const getMessagesToUpdate = async ({
  caseToUpdate,
  oldCase,
}: {
  caseToUpdate: RawCase;
  oldCase: RawCase;
}) => {
  const messageUpdatesNecessary =
    oldCase.docketNumberSuffix !== caseToUpdate.docketNumberSuffix;

  if (!messageUpdatesNecessary) {
    return [];
  }

  const caseMessages = await getMessagesByDocketNumber({
    docketNumber: caseToUpdate.docketNumber,
  });

  if (!caseMessages) {
    return [];
  }

  caseMessages.forEach(message => {
    message.docketNumberSuffix = caseToUpdate.docketNumberSuffix ?? undefined;
  });

  const validMessages = Message.validateRawCollection(caseMessages);

  return validMessages;
};

const getCorrespondencesToUpdate = ({
  caseToUpdate,
  oldCase,
}: {
  caseToUpdate: RawCase;
  oldCase: RawCase;
}) => {
  const {
    added: addedArchivedCorrespondences,
    updated: updatedArchivedCorrespondences,
  } = diff(
    oldCase.archivedCorrespondences,
    caseToUpdate.archivedCorrespondences,
    'correspondenceId',
  );

  const { added: addedCorrespondences, updated: updatedCorrespondences } = diff(
    oldCase.correspondence,
    caseToUpdate.correspondence,
    'correspondenceId',
  );

  const validCorrespondence = Correspondence.validateRawCollection([
    ...addedCorrespondences,
    ...updatedCorrespondences,
    ...addedArchivedCorrespondences,
    ...updatedArchivedCorrespondences,
  ]);

  if (isEmpty(validCorrespondence)) {
    return [];
  }

  return validCorrespondence;
};

const getHearingsToDelete = ({
  caseToUpdate,
  oldCase,
}: {
  caseToUpdate: RawCase;
  oldCase: RawCase;
}) => {
  const { removed: deletedHearings } = diff(
    oldCase.hearings,
    caseToUpdate.hearings,
    'trialSessionId',
  );

  return deletedHearings;
};

const getIrsPractitionersToDeleteAndUpdate = ({
  caseToUpdate,
  oldCase,
}: {
  caseToUpdate: RawCase;
  oldCase: RawCase;
}) => {
  const {
    added: addedIrsPractitioners,
    removed: deletedIrsPractitioners,
    same: unchangedIrsPractitioners,
    updated: updatedIrsPractitioners,
  } = diff(oldCase.irsPractitioners, caseToUpdate.irsPractitioners, 'userId');

  const currentIrsPractitioners = [
    ...addedIrsPractitioners,
    ...updatedIrsPractitioners,
  ];

  if (caseToUpdate.leadDocketNumber && unchangedIrsPractitioners.length) {
    currentIrsPractitioners.push(...unchangedIrsPractitioners);
  }

  const validIrsPractitioners = IrsPractitioner.validateRawCollection(
    currentIrsPractitioners,
  );

  return {
    irsPractitionersToDelete: deletedIrsPractitioners,
    irsPractitionersToUpdate: validIrsPractitioners,
  };
};

const getPrivatePractitionersToDeleteAndUpdate = ({
  caseToUpdate,
  oldCase,
}: {
  caseToUpdate: RawCase;
  oldCase: RawCase;
}) => {
  const {
    added: addedPrivatePractitioners,
    removed: deletedPrivatePractitioners,
    same: unchangedPrivatePractitioners,
    updated: updatedPrivatePractitioners,
  } = diff(
    oldCase.privatePractitioners,
    caseToUpdate.privatePractitioners,
    'userId',
  );

  const currentPrivatePractitioners = [
    ...addedPrivatePractitioners,
    ...updatedPrivatePractitioners,
  ];

  if (caseToUpdate.leadDocketNumber && unchangedPrivatePractitioners.length) {
    currentPrivatePractitioners.push(...unchangedPrivatePractitioners);
  }

  const validPrivatePractitioners = PrivatePractitioner.validateRawCollection(
    currentPrivatePractitioners,
  );

  return {
    privatePractitionersToDelete: deletedPrivatePractitioners,
    privatePractitionersToUpdate: validPrivatePractitioners,
  };
};

const getWorkItemsToUpdate = async ({
  caseToUpdate,
  oldCase,
}: {
  caseToUpdate: RawCase;
  oldCase: RawCase;
}) => {
  const workItemsRequireUpdate =
    oldCase.associatedJudge !== caseToUpdate.associatedJudge;

  if (!workItemsRequireUpdate) {
    return [];
  }

  const workItems = await getWorkItemsByDocketNumber({
    docketNumber: caseToUpdate.docketNumber,
  });

  if (!workItems) {
    return [];
  }

  const updatedWorkItems = workItems.map(rawWorkItem => ({
    ...rawWorkItem,
    associatedJudge: caseToUpdate.associatedJudge,
    associatedJudgeId: caseToUpdate.associatedJudgeId,
  }));

  const validWorkItems = WorkItem.validateRawCollection(updatedWorkItems);
  return validWorkItems;
};

const getCaseDeadlinesToUpdate = async ({
  caseToUpdate,
  oldCase,
}: {
  caseToUpdate: RawCase;
  oldCase: RawCase;
}) => {
  if (oldCase.associatedJudge === caseToUpdate.associatedJudge) {
    return [];
  }
  const deadlines = await getCaseDeadlinesByDocketNumber({
    docketNumber: caseToUpdate.docketNumber,
  });

  deadlines.forEach(caseDeadline => {
    // @ts-ignore
    caseDeadline.associatedJudge = caseToUpdate.associatedJudge;
    // @ts-ignore
    caseDeadline.associatedJudgeId = caseToUpdate.associatedJudgeId;
  });
  const validCaseDeadlines = CaseDeadline.validateRawCollection(deadlines);
  return validCaseDeadlines;
};
