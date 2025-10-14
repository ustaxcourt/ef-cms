import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import { STATE_KEYS } from '@shared/business/entities/EntityConstants';
import {
  createISODateString,
  formatDateString,
  FORMATS,
} from '@shared/business/utilities/DateHandler';
import { Holiday } from '@18f/us-federal-holidays';
import { getHolidaysInDateRange } from '@shared/business/utilities/getHolidaysInDateRange';

export const termBuilderHelper = (
  get: Get,
): { formattedHolidaysInDateRange: { name: string; date: string }[] } => {
  const termState = get(state[STATE_KEYS.TERM_BUILDER_INFORMATION]);

  if (!termState) {
    throw Error('Could not get term state');
  }

  let { termStartDate, termEndDate } = termState;

  termStartDate = formatDateString(
    createISODateString(termStartDate, FORMATS.MMDDYYYY),
    FORMATS.YYYYMMDD,
  );
  termEndDate = formatDateString(
    createISODateString(termEndDate, FORMATS.MMDDYYYY),
    FORMATS.YYYYMMDD,
  );

  const holidaysInDateRange = getHolidaysInDateRange(
    termStartDate,
    termEndDate,
  );
  const formattedHolidaysInDateRange = holidaysInDateRange.map(
    (holiday: Holiday) => {
      return {
        name: holiday.name,
        date: formatDateString(holiday.dateString, FORMATS.MD),
      };
    },
  );
  return { formattedHolidaysInDateRange };
};
