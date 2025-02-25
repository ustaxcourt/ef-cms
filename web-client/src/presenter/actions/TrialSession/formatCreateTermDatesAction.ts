import { FORMATS } from '@shared/business/utilities/DateHandler';
import { state } from '@web-client/presenter/app.cerebral';

export const formatCreateTermDatesAction = ({
  applicationContext,
  get,
}: ActionProps) => {
  const { termEndDate, termName, termStartDate } = get(state.modal);

  const termStartDateISO = applicationContext
    .getUtilities()
    .createISODateString(termStartDate, FORMATS.MMDDYYYY);
  const termEndDateISO = applicationContext
    .getUtilities()
    .createISODateString(termEndDate, FORMATS.MMDDYYYY);

  return {
    termEndDate: termEndDateISO,
    termName,
    termStartDate: termStartDateISO,
  };
};
