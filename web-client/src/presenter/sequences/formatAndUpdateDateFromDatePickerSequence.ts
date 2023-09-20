import { TimeFormats } from '@shared/business/utilities/DateHandler';
import { formatDateFromDatePickerAction } from '@web-client/presenter/actions/formatDateFromDatePickerAction';
import { sequence } from 'cerebral';
import { setFormValueAction } from '../actions/setFormValueAction';

export const formatAndUpdateDateFromDatePickerSequence = sequence<{
  key: string;
  value: string;
  toFormat: TimeFormats;
}>([formatDateFromDatePickerAction, setFormValueAction]);
