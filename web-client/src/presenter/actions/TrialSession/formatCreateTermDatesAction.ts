import { STATE_KEYS } from '@shared/business/entities/EntityConstants';
import { createStartOfDayISOUtc } from '@shared/business/utilities/DateHandler';
import { state } from '@web-client/presenter/app.cerebral';

export const formatCreateTermDatesAction = ({ get }: ActionProps) => {
  const TERM_BUILDER_INFORMATION = get(
    state[STATE_KEYS.TERM_BUILDER_INFORMATION],
  )!;

  const { termStartDate, termEndDate } = TERM_BUILDER_INFORMATION;

  console.log('inside the format action', { termStartDate, termEndDate });
  let [month, day, year] = termStartDate.split('/');
  const termStartDateISO = createStartOfDayISOUtc({ month, day, year });
  [month, day, year] = termEndDate.split('/');
  const termEndDateISO = createStartOfDayISOUtc({ month, day, year });

  return {
    ...TERM_BUILDER_INFORMATION,
    termEndDate: termEndDateISO,
    termStartDate: termStartDateISO,
  };
};
