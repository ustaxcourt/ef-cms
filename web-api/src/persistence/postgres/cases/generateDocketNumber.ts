import { Case } from '@shared/business/entities/cases/Case';
import {
  FORMATS,
  formatDateString,
  formatNow,
} from '@shared/business/utilities/DateHandler';
import { getDbReader } from '@web-api/persistence/postgres/database';

const incrementCounter = async (twoDigitYear: string): Promise<number> => {
  const nextTwoDigitYear = parseInt(twoDigitYear) + 1;
  const nextTwoDigitYearString = nextTwoDigitYear
    .toString()
    .padStart(2, '0')
    .slice(-2);

  const currentYearSortableDocketNumber = Case.getSortableDocketNumber(
    `101-${twoDigitYear}`,
  )!;
  const nextYearSortableDocketNumber = Case.getSortableDocketNumber(
    `101-${nextTwoDigitYearString}`,
  )!;

  const lastCreatedCase = await getDbReader(reader =>
    reader
      .selectFrom('dwCase')
      .where('sortableDocketNumber', '>=', currentYearSortableDocketNumber)
      .where('sortableDocketNumber', '<', nextYearSortableDocketNumber)
      .select(['docketNumber', 'sortableDocketNumber'])
      .orderBy('sortableDocketNumber', 'desc')
      .executeTakeFirst(),
  );

  if (!lastCreatedCase) {
    return 101;
  }

  return parseInt(lastCreatedCase.docketNumber.slice(0, -3)) + 1;
};

const getNextDocketNumber = async ({
  fourDigitYear,
}: {
  fourDigitYear: string;
}) => {
  const twoDigitYear = fourDigitYear.slice(-2);
  const id = await incrementCounter(twoDigitYear);
  return `${id}-${twoDigitYear}`;
};

// Note that this DOES NOT handle concurrency for free, so it should be used within the context of a mutex lock or something similar.
// In the future, this whole process should be outsourced to the DB so the docket number is generated automatically upon successfully saving to DB.
export const generateDocketNumber = async ({
  receivedAt,
}: {
  receivedAt?: string;
}) => {
  const fourDigitYear = receivedAt
    ? formatDateString(receivedAt, FORMATS.YEAR)
    : formatNow(FORMATS.YEAR);

  const docketNumber = await getNextDocketNumber({ fourDigitYear });

  return docketNumber;
};
