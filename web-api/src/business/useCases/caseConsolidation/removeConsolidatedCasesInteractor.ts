import { Case } from '@shared/business/entities/cases/Case';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getCaseDeadlinesByDocketNumber } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByDocketNumber';
import { getCaseDeadlinesByConsolidatedCaseDeadlineIds } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByConsolidatedCaseDeadlineIds';
import {
  CaseDeadline,
  RawCaseDeadline,
} from '@shared/business/entities/CaseDeadline';
import { upsertCaseDeadlines } from '@web-api/persistence/postgres/caseDeadlines/upsertCaseDeadlines';
import { withLocking } from '@web-api/persistence/postgres/utils/mutex';
import { getCasesByDocketNumbers } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';
import { settlePromises } from '@web-api/utilities/settlePromises';
import { getConsolidatedCases } from '@web-api/persistence/postgres/cases/getConsolidatedCases';
import { updateCaseAndAssociations } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { upsertDocketEntries } from '@web-api/persistence/postgres/docketEntries/upsertDocketEntries';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { getDocketEntriesById } from '@web-api/persistence/postgres/docketEntries/getDocketEntriesById';
import { CopyObjectCommand } from '@aws-sdk/client-s3';
import { getStorageClient } from '@web-api/persistence/s3/getStorageClient';
import { environment } from '@web-api/environment';
import { getUniqueId } from '@shared/sharedAppContext';

const removeConsolidatedCases = async (
  _applicationContext: ServerApplicationContext,
  {
    docketNumber,
    docketNumbersToRemove,
  }: { docketNumber: string; docketNumbersToRemove: string[] },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.CONSOLIDATE_CASES)) {
    throw new UnauthorizedError('Unauthorized for case consolidation');
  }

  const caseToUpdate = await getCaseByDocketNumber({
    docketNumber,
  });

  if (!caseToUpdate || !caseToUpdate?.leadDocketNumber) {
    throw new NotFoundError(`Case ${docketNumber} was not found.`);
  }

  const storageClient = getStorageClient();

  const updateCasePromises: Promise<any>[] = [];

  const { leadDocketNumber } = caseToUpdate;

  const allConsolidatedCases = await getConsolidatedCases({
    leadDocketNumber,
  });

  const newConsolidatedCases = allConsolidatedCases.filter(
    consolidatedCase =>
      !docketNumbersToRemove.includes(consolidatedCase.docketNumber),
  );

  if (
    docketNumbersToRemove.includes(leadDocketNumber) &&
    newConsolidatedCases.length > 1
  ) {
    const newLeadCase = Case.findLeadCaseForCases(newConsolidatedCases)!;

    updateCasePromises.push(
      updateConsolidatedCaseDeadlineReferenceId(
        leadDocketNumber,
        newLeadCase.docketNumber,
      ),
    );

    for (const newConsolidatedCaseToUpdate of newConsolidatedCases) {
      const caseEntity = new Case(newConsolidatedCaseToUpdate, {
        authorizedUser,
      });
      caseEntity.setLeadCase(newLeadCase.docketNumber);

      updateCasePromises.push(
        updateCaseAndAssociations({
          authorizedUser,
          caseToUpdate: caseEntity,
        }),
      );
    }
  } else if (newConsolidatedCases.length == 1) {
    // a case cannot be consolidated with itself
    const caseEntity = new Case(newConsolidatedCases[0], {
      authorizedUser,
    });
    caseEntity.removeConsolidation();

    updateCasePromises.push(
      updateCaseAndAssociations({
        authorizedUser,
        caseToUpdate: caseEntity,
      }),
    );
  }

  // TODO: I am pretty sure getCasesByDocketNumbers here (which mimics preexisting logic) is unnecessary and, in fact, dangerous.
  // We already got the case information above via getCasesByLeadDocketNumber.
  // The call here allows a request to remove consolidation on arbitrary docket numbers unrelated to the lead case.
  const casesToRemove = await getCasesByDocketNumbers({
    docketNumbers: docketNumbersToRemove,
  });

  const docketEnIdsToUpdate: Set<string> = new Set();
  const docketEntriesToUpdate: Set<RawDocketEntry> = new Set();
  for (const caseToRemove of casesToRemove) {
    const caseEntity = new Case(caseToRemove, { authorizedUser });
    caseEntity.removeConsolidation();

    updateCasePromises.push(
      updateCaseAndAssociations({
        authorizedUser,
        caseToUpdate: caseEntity,
      }),
    );

    updateCasePromises.push(
      removeConsolidatedCaseReferences(caseToRemove.docketNumber),
    );

    caseToRemove.docketEntries.forEach(docketEntry => {
      if (DocketEntry.isMultiDocketed(docketEntry))
        docketEnIdsToUpdate.add(docketEntry.docketEntryId);
    });

    for (const id of docketEnIdsToUpdate) {
      // entries are docketEntries on ALL cases in the consolidated group
      const entries = await getDocketEntriesById({ docketEntryId: id });
      entries.forEach(entry => {
        docketEntriesToUpdate.add(entry);
      });
    }
  }

  const UPDATED_CASE_DOCKET_ENTRIES: RawDocketEntry[] = [];
  docketEntriesToUpdate.forEach(docketEntry => {
    if (!docketNumbersToRemove.includes(docketEntry.docketNumber)) {
      docketEntry.multiDocketedOn = docketEntry.multiDocketedOn.filter(
        docketNumber => {
          return !docketNumbersToRemove.includes(docketNumber);
        },
      );
    } else {
      docketEntry.multiDocketedOn = [];
      docketEntry.multiDocketedOriginalDocketNumber = undefined;
      const newStorageId = getUniqueId();
      const oldStorageId = docketEntry.documentStorageId;
      const storageCommand = new CopyObjectCommand({
        Bucket: environment.documentsBucketName,
        CopySource: `${environment.documentsBucketName}/${oldStorageId}`,
        Key: newStorageId,
      });
      updateCasePromises.push(storageClient.send(storageCommand));
      docketEntry.documentStorageId = newStorageId;

      if (docketEntry.documentContentsId!!) {
        const newContentsId = getUniqueId();
        const oldContentsId = docketEntry.documentContentsId;
        const contentsCommand = new CopyObjectCommand({
          Bucket: environment.documentsBucketName,
          CopySource: `${environment.documentsBucketName}/${oldContentsId}`,
          Key: newContentsId,
        });
        updateCasePromises.push(storageClient.send(contentsCommand));
        docketEntry.documentContentsId = newContentsId;
      }
    }
    const validatedDocketEntry = new DocketEntry(docketEntry, {
      authorizedUser,
    }).validate();

    UPDATED_CASE_DOCKET_ENTRIES.push(validatedDocketEntry);
  });

  updateCasePromises.push(upsertDocketEntries(UPDATED_CASE_DOCKET_ENTRIES));

  await settlePromises(updateCasePromises);
};

async function removeConsolidatedCaseReferences(docketNumber: string) {
  const CASE_DEADLINES = await getCaseDeadlinesByDocketNumber({
    docketNumber,
  });

  const UPDATED_CASE_DEADLINES = CASE_DEADLINES.map(
    (cd: CaseDeadline) =>
      ({
        ...cd,
        consolidatedCaseDeadlineId: undefined,
      }) as CaseDeadline,
  );

  await upsertCaseDeadlines(UPDATED_CASE_DEADLINES);
}

async function updateConsolidatedCaseDeadlineReferenceId(
  oldLeadDocketNumber: string,
  newLeadDocketNumber: string,
): Promise<void> {
  const LEAD_DEADLINES = await getCaseDeadlinesByDocketNumber({
    docketNumber: oldLeadDocketNumber,
  });

  const DEADLINES_TO_UPDATE: RawCaseDeadline[] = [];

  const results = await Promise.allSettled(
    LEAD_DEADLINES.map(async leadCaseDeadline => {
      const { caseDeadlineId: oldLeadCaseDeadlineId } = leadCaseDeadline;
      const CHILD_DEADLINES =
        await getCaseDeadlinesByConsolidatedCaseDeadlineIds([
          oldLeadCaseDeadlineId,
        ]);

      if (!CHILD_DEADLINES.length) return;

      const NEW_LEAD_CASE_DEADLINE = CHILD_DEADLINES.find(
        ({ docketNumber }) => docketNumber === newLeadDocketNumber,
      );

      const newLeadCaseDeadlineId =
        NEW_LEAD_CASE_DEADLINE?.caseDeadlineId || undefined;

      const updatedDeadlines = CHILD_DEADLINES.map(childCaseDeadline => ({
        ...childCaseDeadline,
        consolidatedCaseDeadlineId:
          childCaseDeadline.docketNumber === newLeadDocketNumber
            ? undefined
            : newLeadCaseDeadlineId,
      }));

      DEADLINES_TO_UPDATE.push(...updatedDeadlines);
    }),
  );

  // Optional: Log any rejected results for debugging
  const rejected = results.filter(r => r.status === 'rejected');
  if (rejected.length > 0) {
    console.warn('Some deadline updates failed:', rejected);
  }

  await upsertCaseDeadlines(DEADLINES_TO_UPDATE);
}

const determineEntitiesToLock = (
  _applicationContext,
  { docketNumber, docketNumbersToRemove = [] },
) => {
  const docketNumbers = [docketNumber, ...docketNumbersToRemove].map(
    item => `case|${item}`,
  );

  return {
    identifiers: docketNumbers,
  };
};

export const removeConsolidatedCasesInteractor = withLocking(
  removeConsolidatedCases,
  determineEntitiesToLock,
);
