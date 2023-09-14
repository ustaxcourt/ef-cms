export const formatDateFromDatePicker = ({
  applicationContext,
  props,
}: ActionProps<{ key: string; value: string }>):
  | { key: string; value: string }
  | undefined => {
  if (props.value) {
    const finalBriefDueDate = applicationContext
      .getUtilities()
      .prepareDateFromString(
        props.value,
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
