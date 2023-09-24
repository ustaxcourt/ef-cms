export const formatDateFromDatePicker = ({
  applicationContext,
  props,
}: ActionProps<{ key: string; value: string }>):
  | { key: string; value: string }
  | undefined => {
  if (props.value) {
    const [month, day, year] = props.value.split('/');

    const formattedMonth = month?.length === 1 ? `0${month}` : month;
    const formattedDay = day?.length === 1 ? `0${day}` : day;

    const zeroPaddedDate = `${formattedMonth}/${formattedDay}/${year}`;

    const finalBriefDueDate = applicationContext
      .getUtilities()
      .prepareDateFromString(
        zeroPaddedDate,
        applicationContext.getConstants().DATE_FORMATS.MMDDYYYY,
      );

    const formattedDate = applicationContext
      .getUtilities()
      .formatDateString(
        finalBriefDueDate,
        applicationContext.getConstants().DATE_FORMATS.YYYYMMDD,
      );

    return {
      key: props.key,
      value: formattedDate,
    };
  }
};
