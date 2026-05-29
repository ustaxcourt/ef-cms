import { Case } from '@shared/business/entities/cases/Case';
import { CaseFactory } from '@web-api/business/entities/cases/CaseFactory';
import { NotFoundError } from '@web-api/errors/errors';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';

const PAGE_SIZE = 1000;
const MAX_PAGE = 20;

export const getPublicCaseDocketEntriesInteractor = async ({
  docketNumber,
  page = 0,
}: {
  docketNumber: string;
  page?: number;
}) => {
  if (!Number.isFinite(page) || page < 0 || page > MAX_PAGE) {
    throw new Error(
      `Invalid page '${page}'. Must be a number between 0 and ${MAX_PAGE}`,
    );
  }

  const formattedDocketNumber = Case.formatDocketNumber(docketNumber);

  const rawCaseRecord = await getCaseByDocketNumber({
    docketNumber: formattedDocketNumber,
  });

  if (!rawCaseRecord.docketNumber && !rawCaseRecord.entityName) {
    const error = new NotFoundError(`Case ${docketNumber} was not found.`);
    error.skipLogging = true;
    throw error;
  }

  const caseDTO = CaseFactory.getCaseDTO({
    rawCase: rawCaseRecord,
    user: undefined,
  });

  const allDocketEntries = caseDTO.docketEntries;
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
