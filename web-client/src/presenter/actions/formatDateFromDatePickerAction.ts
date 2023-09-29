import { FORMATS, TimeFormats } from '@shared/business/utilities/DateHandler';

export const formatDateFromDatePickerAction = ({
  applicationContext,
  props,
}: ActionProps<{ key: string; value: string; toFormat: TimeFormats }>):
  | { key: string; value: string }
  | undefined => {
  if (props.value) {
    let inputFormat: TimeFormats;

    try {
      inputFormat = applicationContext
        .getUtilities()
        .getDateFormat(props.value, [FORMATS.MDYYYY, FORMATS.MMDDYYYY]);

      const luxonDate = applicationContext
        .getUtilities()
        .prepareDateFromString(props.value, inputFormat);

      const formattedDate = applicationContext
        .getUtilities()
        .formatDateString(luxonDate, props.toFormat);

      return {
        key: props.key,
        value: formattedDate,
      };
    } catch {
      return {
        key: props.key,
        value: props.value,
      };
    }
  }
};
