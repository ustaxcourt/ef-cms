import { STATE_KEYS } from '@shared/business/entities/EntityConstants';
import { createEndOfDayISOUtc, createStartOfDayISOUtc } from '@shared/business/utilities/DateHandler';
import { state } from '@web-client/presenter/app.cerebral';

export const formatCreateTermDatesAction = ({ get }: ActionProps) => {
  const TERM_BUILDER_INFORMATION = get(
    state[STATE_KEYS.TERM_BUILDER_INFORMATION],
  )!;

  const { termStartDate, termEndDate } = TERM_BUILDER_INFORMATION;

  const termStartDateISO = createStartOfDayISOUtc(termStartDate);
  const termEndDateISO = createEndOfDayISOUtc(termEndDate);

  return {
    ...TERM_BUILDER_INFORMATION,
    termEndDate: termEndDateISO,
    termStartDate: termStartDateISO,
  };
};
