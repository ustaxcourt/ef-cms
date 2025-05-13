import {
  FORMATS,
  formatDateString,
  formatNow,
  getMonthDayYearInETObj,
} from '@shared/business/utilities/DateHandler';
import { getDbWriter } from '@web-api/database';

const incrementCounter = async (year: string): Promise<number> => {
  if (!year) {
    year = `${getMonthDayYearInETObj().year}`;
  }

  const yearAsNum = parseInt(year);
  const biggerThanThis = parseInt(`${yearAsNum}000000`);
  const smallerThanThis = parseInt(`${yearAsNum + 1}000000`);
  console.log({
    yearAsNum,
    biggerThanThis,
    smallerThanThis,
  });
  // 2024020545
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

export const getNextDocketNumber = async ({ year }: { year: string }) => {
  const id = await incrementCounter(year);
  const twoDigitYear = year.slice(-2);
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
