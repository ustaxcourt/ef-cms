import { Case } from '@shared/business/entities/cases/Case';
import { CaseFactory } from '@shared/business/entities/cases/CaseFactory';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  UnknownAuthUser,
  isAuthUser,
} from '@shared/business/entities/authUser/AuthUser';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getWorkItemsByDocketNumber } from '@web-api/persistence/postgres/workitems/getWorkItemsByDocketNumber';

const PAGE_SIZE = 1000;
const MAX_PAGE = 20;

export const getCaseDocketEntriesInteractor = async (
  {
    docketNumber,
    page = 0,
  }: {
    docketNumber: string;
    page?: number;
  },
  authorizedUser: UnknownAuthUser,
) => {
  if (page > MAX_PAGE) {
    throw new Error(
      `Page ${page} exceeds the maximum allowed page of ${MAX_PAGE}`,
    );
  }

  if (!isAuthUser(authorizedUser)) {
    throw new UnauthorizedError(
      `Invalid User attempting to view docket Number: ${docketNumber}`,
    );
  }

  const formattedDocketNumber = Case.formatDocketNumber(docketNumber);

  const [caseRecord, workItems] = await Promise.all([
    getCaseByDocketNumber({
      docketNumber: formattedDocketNumber,
      user: authorizedUser,
    }),
    getWorkItemsByDocketNumber({
      docketNumber: formattedDocketNumber,
    }),
  ]);

  const isValidCase = Boolean(caseRecord?.docketNumber);

  if (!isValidCase) {
    const error = new NotFoundError(`Case ${docketNumber} was not found.`);
    error.skipLogging = true;
    throw error;
  }

  const theCase = CaseFactory.getCaseDTO({
    rawCase: caseRecord,
    user: authorizedUser,
  });

  // Enrich docket entries with work item info needed by the UI
  const workItemByDocketEntryId = new Map<string, (typeof workItems)[0]>(
    workItems.map(wi => [wi.docketEntryId, wi]),
  );
  const allDocketEntries = theCase.docketEntries.map(docketEntry => {
    const workItem = workItemByDocketEntryId.get(docketEntry.docketEntryId);

    return {
      ...docketEntry,
      qcComplete: !!workItem?.completedAt,
      qcViewed: !!workItem?.isRead,
      workItemId: workItem?.workItemId,
    };
  });

  const totalCount = allDocketEntries.length;
  const start = page * PAGE_SIZE;
  const docketEntries = allDocketEntries.slice(start, start + PAGE_SIZE);

  return {
    docketEntries,
    page,
    pageSize: PAGE_SIZE,
    totalCount,
  };
};
