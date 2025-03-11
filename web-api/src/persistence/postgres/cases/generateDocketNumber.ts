import {
  FORMATS,
  formatDateString,
  formatNow,
  getMonthDayYearInETObj,
} from '@shared/business/utilities/DateHandler';
import { getCaseMetadataByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseMetadataByDocketNumber';
import { getDbWriter } from '@web-api/database';
import { getLogger } from '@web-api/utilities/logger/getLogger';

const incrementCounter = async (year: string): Promise<number> => {
  if (!year) {
    year = `${getMonthDayYearInETObj().year}`;
  }
  const twoDigitYear = year.slice(-2);

  // Using DbWriter instead of DbReader to avoid latency between writer and reader
  const theCase = await getDbWriter({
    cb: writer =>
      writer
        .selectFrom('dwCase')
        .where('docketNumber', 'like', `%-${twoDigitYear}`)
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
  const twoDigitYear = year.slice(-2);
  const id = await incrementCounter(twoDigitYear);
  return `${id}-${twoDigitYear}`;
};

export const MAX_ATTEMPTS = 5;

export const generateDocketNumber = async ({
  receivedAt,
}: {
  receivedAt?: string;
}) => {
  const year = receivedAt
    ? formatDateString(receivedAt, FORMATS.YEAR)
    : formatNow(FORMATS.YEAR);

  let attempt = 0;
  let nextDocketNumber;

  const docketNumber = await (async () => {
    while (attempt < MAX_ATTEMPTS) {
      nextDocketNumber = await getNextDocketNumber({
        year,
      });

      const existingCase = await getCaseMetadataByDocketNumber({
        docketNumber: nextDocketNumber,
      });
      if (!existingCase) {
        return nextDocketNumber;
      }

      attempt++;
    }
  })();

  if (docketNumber) {
    return docketNumber;
  } else {
    // be sure case with this docket number doesn't already exist -- if it does, stop!
    const message = `${nextDocketNumber}: docket number already exists!`;
    getLogger().error(message, nextDocketNumber);
    throw new Error(message);
  }
};
