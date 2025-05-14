import { Case } from '@shared/business/entities/cases/Case';
import {
  FORMATS,
  formatDateString,
  formatNow,
} from '@shared/business/utilities/DateHandler';
import { getDbWriter } from '@web-api/database';

const incrementCounter = async (twoDigitYear: string): Promise<number> => {
  const nextTwoDigitYear = parseInt(twoDigitYear) + 1;
  const nextTwoDigitYearString = nextTwoDigitYear.toString().padStart(2, '0');

  const biggerThanThis = Case.getSortableDocketNumber(`101-${twoDigitYear}`)!;
  const smallerThanThis = Case.getSortableDocketNumber(
    `101-${nextTwoDigitYearString}`,
  )!;

  // Using DbWriter instead of DbReader to avoid latency between writer and reader
  const theCase = await getDbWriter({
    cb: writer =>
      writer
        .selectFrom('dwCase')
        .where('sortableDocketNumber', '>=', biggerThanThis)
        .where('sortableDocketNumber', '<', smallerThanThis)
        .select(['docketNumber', 'sortableDocketNumber'])
        .orderBy('sortableDocketNumber', 'desc')
        .executeTakeFirst(),
    table: null,
  });

  if (!theCase) {
    return 101;
  }

  return parseInt(theCase.docketNumber.slice(0, -3)) + 1;
};

const getNextDocketNumber = async ({ year }: { year: string }) => {
  const twoDigitYear = year.slice(-2);
  const id = await incrementCounter(twoDigitYear);
  return `${id}-${twoDigitYear}`;
};

// Note that this DOES NOT handle concurrency for free, so it should be used within the context of a mutex lock or something similar.
export const generateDocketNumber = async ({
  receivedAt,
}: {
  receivedAt?: string;
}) => {
  const year = receivedAt
    ? formatDateString(receivedAt, FORMATS.YEAR)
    : formatNow(FORMATS.YEAR);

  const start = Date.now();

  const docketNumber = await getNextDocketNumber({ year });

  console.log(
    'docketNumber investigation 2 getNextDocketNumber',
    Date.now() - start,
  );

  return docketNumber;
};
