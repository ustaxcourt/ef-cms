import { STATE_KEYS } from '@shared/business/entities/EntityConstants';
import {
  createISODateString,
  formatDateString,
  FORMATS,
} from '@shared/business/utilities/DateHandler';
import { state } from '@web-client/presenter/app.cerebral';

export const formatCreateTermDatesAction = ({ get }: ActionProps) => {
  const TERM_BUILDER_INFORMATION = get(
    state[STATE_KEYS.TERM_BUILDER_INFORMATION],
  )!;

  const { termStartDate, termEndDate } = TERM_BUILDER_INFORMATION;

  const termStartDateISONoTimeZone = formatDateString(
    createISODateString(termStartDate, FORMATS.MMDDYYYY),
    FORMATS.YYYYMMDD,
  );
  const termEndDateISONoTimeZone = formatDateString(
    createISODateString(termEndDate, FORMATS.MMDDYYYY),
    FORMATS.YYYYMMDD,
  );

  return {
    ...TERM_BUILDER_INFORMATION,
    termEndDate: termEndDateISONoTimeZone,
    termStartDate: termStartDateISONoTimeZone,
  };
};
