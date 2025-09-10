import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import { STATE_KEYS } from '@shared/business/entities/EntityConstants';
import {
  formatDateString,
  FORMATS,
} from '@shared/business/utilities/DateHandler';
import { getHolidaysInDateRange } from '@shared/business/utilities/getHolidaysInDateRange';
import { Holiday } from '@18f/us-federal-holidays';

export const termBuilderHelper = (get: Get): any => {
  const { termStartDate, termEndDate } =
    get(state[STATE_KEYS.TERM_BUILDER_INFORMATION]) ?? {};

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
  return { holidaysInDateRange, formattedHolidaysInDateRange };
};
