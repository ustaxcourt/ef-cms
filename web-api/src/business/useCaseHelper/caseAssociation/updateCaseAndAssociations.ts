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
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getMessagesByDocketNumber } from '@web-api/persistence/postgres/messages/getMessagesByDocketNumber';
import { getCaseDeadlinesByDocketNumber } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByDocketNumber';
import { isEmpty, omit } from 'lodash';
import { upsertCaseCorrespondences } from '@web-api/persistence/postgres/caseCorrespondences/upsertCaseCorrespondences';
import { upsertCaseDeadlines } from '@web-api/persistence/postgres/caseDeadlines/upsertCaseDeadlines';
import diff from 'diff-arrays-of-objects';
import { upsertDocketEntries } from '@web-api/persistence/postgres/docketEntries/upsertDocketEntries';
import { settlePromises } from '@web-api/utilities/settlePromises';
import { upsertCases } from '@web-api/persistence/postgres/cases/upsertCases';
import { associateUsersWithCases } from '@web-api/persistence/postgres/cases/userOnCase/associateUsersWithCases';
import { disassociateUsersFromCases } from '@web-api/persistence/postgres/cases/userOnCase/disassociateUsersFromCases';
import { Role, ROLES } from '@shared/business/entities/EntityConstants';
import { removeCasesFromHearings } from '@web-api/persistence/postgres/trialSessions/removeCasesFromHearings';
import { upsertMessages } from '@web-api/persistence/postgres/messages/upsertMessages';

export const updateCaseAndAssociations = async ({
  authorizedUser,
  caseToUpdate,
  includeCorrespondence = true,
  oldCase,
}: {
  authorizedUser: UnknownAuthUser;
  caseToUpdate: any;
  includeCorrespondence?: boolean;
  oldCase?: RawCase;
}): Promise<RawCase> => {
  // Validate the old (pre-update) and new (post-update) case entity
  const newCaseEntity: Case = caseToUpdate.validate
    ? caseToUpdate
    : new Case(caseToUpdate, {
        authorizedUser,
      });

  const oldCaseEntity =
    oldCase ??
    (await getCaseByDocketNumber({
      docketNumber: caseToUpdate.docketNumber,
      includeConsolidatedCases: false,
    }));

  newCaseEntity.recomputeHasPendingItems();
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

  // Split docket entries: those with servedParties loaded can be fully upserted;
  // those without must exclude servedParties to avoid overwriting existing DB values with null.
  const docketEntriesWithServedParties = docketEntries.filter(
    de => de.servedParties !== undefined,
  );
  const docketEntriesWithoutServedParties = docketEntries.filter(
    de => de.servedParties === undefined,
  );

  // Then persist all related case data
  await settlePromises([
    upsertDocketEntries(docketEntriesWithServedParties),
    upsertDocketEntries(docketEntriesWithoutServedParties, {
      excludeFromUpdateColumns: ['servedParties'],
    }),
    upsertMessages(messages),
    upsertCaseCorrespondences(correspondences),
    removeCasesFromHearings({
      trialSessionCases: deletedHearings.map(dh => ({
        trialSessionId: dh.trialSessionId,
        docketNumber: caseToUpdate.docketNumber,
      })),
    }),
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
  irsPractitionersToDelete: (RawIrsPractitioner & {
    docketNumber: string;
    actingAsRole: Role;
  })[];
  irsPractitionersToUpdate: (RawIrsPractitioner & {
    docketNumber: string;
    actingAsRole: Role;
  })[];
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
      actingAsRole: ROLES.irsPractitioner,
    })),
    irsPractitionersToUpdate: validIrsPractitioners.map(irs => ({
      ...irs,
      docketNumber: caseToUpdate.docketNumber,
      actingAsRole: ROLES.irsPractitioner,
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
    actingAsRole: Role;
  })[];
  privatePractitionersToUpdate: (RawPrivatePractitioner & {
    docketNumber: string;
    actingAsRole: Role;
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
      actingAsRole: ROLES.privatePractitioner,
    })),
    privatePractitionersToUpdate: validPrivatePractitioners.map(pp => ({
      ...pp,
      docketNumber: caseToUpdate.docketNumber,
      actingAsRole: ROLES.privatePractitioner,
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
    actingAsRole: Role;
  })[];
  petitionersToUpdate: (TPetitioner & {
    docketNumber: string;
    userId: string;
    actingAsRole: Role;
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
      actingAsRole: ROLES.petitioner,
    })),
    petitionersToUpdate: currentPetitioners.map(petitioner => ({
      ...petitioner,
      userId: petitioner.contactId,
      docketNumber: caseToUpdate.docketNumber,
      actingAsRole: ROLES.petitioner,
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
