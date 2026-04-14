import { formatDateFromDatePicker, TimeFormats } from '@shared/business/utilities/DateHandler';

export const formatDateFromDatePickerAction = ({
  props,
}: ActionProps<{ key: string; value: string; toFormat: TimeFormats }>):
  | { key: string; value: string }
  | undefined => {
  if (props.value) {
    const formattedDate = formatDateFromDatePicker(props.value, props.toFormat);
    return {
      key: props.key,
      value: formattedDate,
    };
  }
};
