// change the date from MM/DD/YYYY to YYYY-MM-DD

export const formatDateAction = ({
  applicationContext,
  props,
}: ActionProps) => {
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
