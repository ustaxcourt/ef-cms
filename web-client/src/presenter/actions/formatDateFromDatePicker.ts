import { TimeFormats } from '@shared/business/utilities/DateHandler';

export const formatDateFromDatePicker = ({
  applicationContext,
  props,
}: ActionProps<{ key: string; value: string; toFormat: TimeFormats }>):
  | { key: string; value: string }
  | undefined => {
  if (props.value) {
    const [month, day, year] = props.value.split('/');
    const formattedMonth = month.length === 1 ? `0${month}` : month;
    const formattedDay = day.length === 1 ? `0${day}` : day;

    const zeroPaddedDate = `${formattedMonth}/${formattedDay}/${year}`;

    const finalBriefDueDate = applicationContext
      .getUtilities()
      .prepareDateFromString(
        zeroPaddedDate,
        applicationContext.getConstants().DATE_FORMATS.MMDDYYYY,
      );

    const formattedDate = applicationContext
      .getUtilities()
      .formatDateString(finalBriefDueDate, props.toFormat);

    return {
      key: props.key,
      value: formattedDate,
    };
  }
};
