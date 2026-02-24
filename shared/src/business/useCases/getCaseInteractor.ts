import { Case } from '@shared/business/entities/cases/Case';
import { CaseFactory } from '@shared/business/entities/cases/CaseFactory';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  UnknownAuthUser,
  isAuthUser,
} from '@shared/business/entities/authUser/AuthUser';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getWorkItemsByDocketNumber } from '@web-api/persistence/postgres/workitems/getWorkItemsByDocketNumber';
import { CaseDTO } from '@shared/business/dto/cases/CaseDTO';
import { RestrictedCaseDTO } from '@shared/business/dto/cases/RestrictedCaseDTO';
import { PublicCaseDTO } from '@shared/business/dto/cases/PublicCaseDTO';
import { UNSERVABLE_EVENT_CODES } from '@shared/business/entities/EntityConstants';
import { getDbReader } from '@web-api/database';

export const getCaseInteractor = async (
  {
    docketNumber,
    excludeDocketEntries,
  }: { docketNumber: string; excludeDocketEntries?: boolean },
  authorizedUser: UnknownAuthUser,
): Promise<CaseDTO | RestrictedCaseDTO | PublicCaseDTO> => {
  if (!isAuthUser(authorizedUser)) {
    throw new UnauthorizedError(
      `Invalid User attempting to view docket Number: ${docketNumber}`,
    );
  }

  const formattedDocketNumber = Case.formatDocketNumber(docketNumber);

  const [caseRecord, workItems] = await Promise.all([
    getCaseByDocketNumber({
      docketNumber: formattedDocketNumber,
      excludeFields: excludeDocketEntries ? ['docketEntries'] : undefined,
      user: authorizedUser,
    }),
    excludeDocketEntries
      ? Promise.resolve([])
      : getWorkItemsByDocketNumber({
          docketNumber: formattedDocketNumber,
        }),
  ]);

  const isValidCase = Boolean(caseRecord?.docketNumber);

  if (!isValidCase) {
    const error = new NotFoundError(`Case ${docketNumber} was not found.`);
    error.skipLogging = true;
    throw error;
  }

  if (excludeDocketEntries) {
    const [hasPendingItems, petitionIsServed] = await Promise.all([
      computeHasPendingItems(formattedDocketNumber),
      computePetitionServedStatus(formattedDocketNumber),
    ]);
    caseRecord.hasPendingItems = hasPendingItems;
    (caseRecord as RawCase & { petitionIsServed: boolean }).petitionIsServed =
      petitionIsServed;
  }

  const theCase = CaseFactory.getCaseDTO({
    rawCase: caseRecord,
    user: authorizedUser,
  });

  if (excludeDocketEntries) {
    return theCase;
  }

  // The UI needs some work item info associated with the docket entry, so we attach that here
  const workItemByDocketEntryId = new Map<string, (typeof workItems)[0]>(
    workItems.map(wi => [wi.docketEntryId, wi]),
  );
  const docketEntriesWithUIInfo = theCase.docketEntries.map(docketEntry => {
    const workItem = workItemByDocketEntryId.get(docketEntry.docketEntryId);

    return {
      ...docketEntry,
      qcComplete: !!workItem?.completedAt,
      qcViewed: !!workItem?.isRead,
      workItemId: workItem?.workItemId,
    };
  });

  return { ...theCase, docketEntries: docketEntriesWithUIInfo } as
    | CaseDTO
    | RestrictedCaseDTO
    | PublicCaseDTO;
};

async function computeHasPendingItems(
  docketNumber: string,
): Promise<boolean> {
  const pendingEntries = await getDbReader(reader =>
    reader
      .selectFrom('dwDocketEntry')
      .where('docketNumber', '=', docketNumber)
      .where('pending', '=', true)
      .select(['servedAt', 'eventCode'])
      .execute(),
  );

  return pendingEntries.some(
    entry =>
      entry.servedAt !== null ||
      UNSERVABLE_EVENT_CODES.includes(entry.eventCode),
  );
}

async function computePetitionServedStatus(
  docketNumber: string,
): Promise<boolean> {
  const petitionEntry = await getDbReader(reader =>
    reader
      .selectFrom('dwDocketEntry')
      .where('docketNumber', '=', docketNumber)
      .where('documentType', '=', 'Petition')
      .select(['servedAt'])
      .executeTakeFirst(),
  );

  return !!petitionEntry?.servedAt;
}
