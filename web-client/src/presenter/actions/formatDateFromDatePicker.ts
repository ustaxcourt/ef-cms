import { TimeFormats } from '@shared/business/utilities/DateHandler';

export const formatDateFromDatePicker = ({
  applicationContext,
  props,
}: ActionProps<{ key: string; value: string; toFormat: TimeFormats }>):
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
      .formatDateString(finalBriefDueDate, props.toFormat);
    console.log('formattedDate', formattedDate);
    return {
      key: props.key,
      value: formattedDate,
    };
  }
};
