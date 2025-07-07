import { Case } from '@shared/business/entities/cases/Case';
import {
  CaseDeadline,
  RawCaseDeadline,
} from '@shared/business/entities/CaseDeadline';
import {
  Correspondence,
  RawCorrespondence,
} from '@shared/business/entities/Correspondence';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import {
  IrsPractitioner,
  RawIrsPractitioner,
} from '@shared/business/entities/IrsPractitioner';
import { Message, RawMessage } from '@shared/business/entities/Message';
import {
  PrivatePractitioner,
  RawPrivatePractitioner,
} from '@shared/business/entities/PrivatePractitioner';
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
import { associateUsersWithCases } from '@web-api/persistence/postgres/cases/userOnCase/associateUsersWithCases';
import { disassociateUsersFromCases } from '@web-api/persistence/postgres/cases/userOnCase/disassociateUsersFromCases';

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
    { petitionersToDelete, petitionersToUpdate },
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
    getPetitionersToDeleteAndUpdate({
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
    ...messages.map(message => updateMessage({ message })),
    upsertCaseCorrespondences(correspondences),
    ...deletedHearings.map(({ trialSessionId }) =>
      removeCaseFromHearing({
        applicationContext,
        docketNumber: caseToUpdate.docketNumber,
        trialSessionId,
      }),
    ),
    associateUsersWithCases([
      ...irsPractitionersToUpdate,
      ...privatePractitionersToUpdate,
      ...petitionersToUpdate,
    ]),
    disassociateUsersFromCases([
      ...irsPractitionersToDelete,
      ...privatePractitionersToDelete,
      ...petitionersToDelete,
    ]),
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
}): RawDocketEntry[] => {
  // We are not comparing work item changes as we do not save the work item on the docket entry in persistence
  const { added: addedDocketEntries, updated: updatedDocketEntries } = diff(
    oldCase.docketEntries.map(d => omit(d, 'workItem')),
    caseToUpdate.docketEntries.map(d => omit(d, 'workItem')),
    'docketEntryId',
  );

  const {
    added: addedArchivedDocketEntries,
    updated: updatedArchivedDocketEntries,
  } = diff(
    oldCase.archivedDocketEntries?.map(d => omit(d, 'workItem')),
    caseToUpdate.archivedDocketEntries?.map(d => omit(d, 'workItem')),
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
}): Promise<RawMessage[]> => {
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
}): RawCorrespondence[] => {
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
}): any[] => {
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
}): {
  irsPractitionersToDelete: (RawIrsPractitioner & { docketNumber: string })[];
  irsPractitionersToUpdate: (RawIrsPractitioner & { docketNumber: string })[];
} => {
  const {
    added: addedIrsPractitioners,
    removed: deletedIrsPractitioners,
    updated: updatedIrsPractitioners,
  } = diff(oldCase.irsPractitioners, caseToUpdate.irsPractitioners, 'userId');

  const currentIrsPractitioners = [
    ...addedIrsPractitioners,
    ...updatedIrsPractitioners,
  ];

  const validIrsPractitioners = IrsPractitioner.validateRawCollection(
    currentIrsPractitioners,
  );

  return {
    irsPractitionersToDelete: deletedIrsPractitioners.map(irs => ({
      ...irs,
      docketNumber: caseToUpdate.docketNumber,
    })),
    irsPractitionersToUpdate: validIrsPractitioners.map(irs => ({
      ...irs,
      docketNumber: caseToUpdate.docketNumber,
    })),
  };
};

const getPrivatePractitionersToDeleteAndUpdate = ({
  caseToUpdate,
  oldCase,
}: {
  caseToUpdate: RawCase;
  oldCase: RawCase;
}): {
  privatePractitionersToDelete: (RawPrivatePractitioner & {
    docketNumber: string;
  })[];
  privatePractitionersToUpdate: (RawPrivatePractitioner & {
    docketNumber: string;
  })[];
} => {
  const {
    added: addedPrivatePractitioners,
    removed: deletedPrivatePractitioners,
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

  const validPrivatePractitioners = PrivatePractitioner.validateRawCollection(
    currentPrivatePractitioners,
  );

  return {
    privatePractitionersToDelete: deletedPrivatePractitioners.map(pp => ({
      ...pp,
      docketNumber: caseToUpdate.docketNumber,
    })),
    privatePractitionersToUpdate: validPrivatePractitioners.map(pp => ({
      ...pp,
      docketNumber: caseToUpdate.docketNumber,
    })),
  };
};

const getPetitionersToDeleteAndUpdate = ({
  caseToUpdate,
  oldCase,
}: {
  caseToUpdate: RawCase;
  oldCase: RawCase;
}): {
  petitionersToDelete: (TPetitioner & {
    docketNumber: string;
    userId: string;
  })[];
  petitionersToUpdate: (TPetitioner & {
    docketNumber: string;
    userId: string;
  })[];
} => {
  const {
    added: addedPetitioners,
    removed: deletedPetitioners,
    updated: updatedPetitioners,
  } = diff(oldCase.petitioners, caseToUpdate.petitioners, 'contactId');

  const currentPetitioners = [...addedPetitioners, ...updatedPetitioners];

  return {
    petitionersToDelete: deletedPetitioners.map(petitioner => ({
      ...petitioner,
      userId: petitioner.contactId,
      docketNumber: caseToUpdate.docketNumber,
    })),
    petitionersToUpdate: currentPetitioners.map(petitioner => ({
      ...petitioner,
      userId: petitioner.contactId,
      docketNumber: caseToUpdate.docketNumber,
    })),
  };
};

const getCaseDeadlinesToUpdate = async ({
  caseToUpdate,
  oldCase,
}: {
  caseToUpdate: RawCase;
  oldCase: RawCase;
}): Promise<RawCaseDeadline[]> => {
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
