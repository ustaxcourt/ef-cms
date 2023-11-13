import { TimeFormats } from '@shared/business/utilities/DateHandler';
import { formatDateFromDatePickerAction } from '@web-client/presenter/actions/formatDateFromDatePickerAction';
import { setFormValueAction } from '../actions/setFormValueAction';

export const formatAndUpdateDateFromDatePickerSequence = [
  formatDateFromDatePickerAction,
  setFormValueAction,
] as unknown as (props: {
  key: string;
  value: string;
  toFormat: TimeFormats;
}) => void;
