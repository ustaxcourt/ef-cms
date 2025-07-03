import { Case } from '@shared/business/entities/cases/Case';
import { CaseDeadline } from '@shared/business/entities/CaseDeadline';
import { Correspondence } from '@shared/business/entities/Correspondence';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { IrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { Message } from '@shared/business/entities/Message';
import { PrivatePractitioner } from '@shared/business/entities/PrivatePractitioner';
import { applicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getMessagesByDocketNumber } from '@web-api/persistence/postgres/messages/getMessagesByDocketNumber';
import { updateMessage } from '@web-api/persistence/postgres/messages/updateMessage';
import { getCaseDeadlinesByDocketNumber } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByDocketNumber';
import { isEmpty, omit } from 'lodash';
import { upsertCaseCorrespondences } from '@web-api/persistence/postgres/caseCorrespondences/upsertCaseCorrespondences';
import { upsertCaseDeadlines } from '@web-api/persistence/postgres/caseDeadlines/upsertCaseDeadlines';
import diff from 'diff-arrays-of-objects';
import { upsertDocketEntries } from '@web-api/persistence/postgres/docketEntries/upsertDocketEntries';
import { settlePromises } from '@web-api/utilities/settlePromises';
import { upsertCases } from '@web-api/persistence/postgres/cases/upsertCases';
import { removeCaseFromHearing } from '@web-api/persistence/dynamo/trialSessions/removeCaseFromHearing';
import {
  removeIrsPractitionerOnCase,
  removePrivatePractitionerOnCase,
} from '@web-api/persistence/dynamo/cases/removePractitionerOnCase';
import {
  updateIrsPractitionerOnCase,
  updatePrivatePractitionerOnCase,
} from '@web-api/persistence/dynamo/cases/updatePractitionerOnCase';

// Because we used to rely on Dynamo, we needed to manually maintain relations in app code.
// In the future, it would be good to avoid doing so by leveraging SQL more effectively.
export const updateCaseAndAssociations = async ({
  authorizedUser,
  caseToUpdate,
  includeCorrespondence = true,
}: {
  authorizedUser: UnknownAuthUser;
  caseToUpdate: any;
  includeCorrespondence?: boolean;
}): Promise<RawCase> => {
  // Validate the old (pre-update) and new (post-update) case entity
  const newCaseEntity: Case = caseToUpdate.validate
    ? caseToUpdate
    : new Case(caseToUpdate, {
        authorizedUser,
      });

  const oldCaseEntity = await getCaseByDocketNumber({
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
    includeCorrespondence
      ? getCorrespondencesToUpdate({
          caseToUpdate: validNewRawCaseEntity,
          oldCase: validRawOldCaseEntity,
        })
      : [],
  ]);

  // Persist primary case data first to ensure no errors
  await upsertCases([validNewRawCaseEntity]);

  // Then persist all related case data
  await settlePromises([
    upsertDocketEntries(docketEntries),
    ...messages.map(message => updateMessage(message)),
    upsertCaseCorrespondences(correspondences),
    ...deletedHearings.map(({ trialSessionId }) =>
      removeCaseFromHearing({
        applicationContext,
        docketNumber: caseToUpdate.docketNumber,
        trialSessionId,
      }),
    ),
    ...irsPractitionersToDelete.map(practitioner =>
      removeIrsPractitionerOnCase({
        applicationContext,
        docketNumber: caseToUpdate.docketNumber,
        userId: practitioner.userId,
      }),
    ),
    ...irsPractitionersToUpdate.map(practitioner =>
      updateIrsPractitionerOnCase({
        applicationContext,
        docketNumber: caseToUpdate.docketNumber,
        leadDocketNumber: caseToUpdate.leadDocketNumber,
        practitioner,
        userId: practitioner.userId,
      }),
    ),
    ...privatePractitionersToDelete.map(practitioner =>
      removePrivatePractitionerOnCase({
        applicationContext,
        docketNumber: caseToUpdate.docketNumber,
        userId: practitioner.userId,
      }),
    ),
    ...privatePractitionersToUpdate.map(practitioner =>
      updatePrivatePractitionerOnCase({
        applicationContext,
        docketNumber: caseToUpdate.docketNumber,
        leadDocketNumber: caseToUpdate.leadDocketNumber,
        // @ts-ignore
        practitioner,
        userId: practitioner.userId,
      }),
    ),
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
  const fieldsToIgnore = ['workItemId', 'qcViewed', 'qcComplete']; // These are bits of work-item data irrelevant to docket entry persistence
  const { added: addedDocketEntries, updated: updatedDocketEntries } = diff(
    oldCase.docketEntries.map(d => omit(d, fieldsToIgnore)),
    caseToUpdate.docketEntries.map(d => omit(d, fieldsToIgnore)),
    'docketEntryId',
  );

  const {
    added: addedArchivedDocketEntries,
    updated: updatedArchivedDocketEntries,
  } = diff(
    oldCase.archivedDocketEntries?.map(d => omit(d, fieldsToIgnore)),
    caseToUpdate.archivedDocketEntries?.map(d => omit(d, fieldsToIgnore)),
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
