import { STATE_KEYS } from '@shared/business/entities/EntityConstants';
import { FORMATS } from '@shared/business/utilities/DateHandler';
import { state } from '@web-client/presenter/app.cerebral';

export const formatCreateTermDatesAction = ({
  applicationContext,
  get,
}: ActionProps) => {
  const TERM_BUILDER_INFORMATION = get(
    state[STATE_KEYS.TERM_BUILDER_INFORMATION],
  )!;

  const { termStartDate, termEndDate } = TERM_BUILDER_INFORMATION;

  const termStartDateISO = applicationContext
    .getUtilities()
    .createISODateString(termStartDate, FORMATS.MMDDYYYY);
  const termEndDateISO = applicationContext
    .getUtilities()
    .createISODateString(termEndDate, FORMATS.MMDDYYYY);

  return {
    ...TERM_BUILDER_INFORMATION,
    termEndDate: termEndDateISO,
    termStartDate: termStartDateISO,
  };
};
