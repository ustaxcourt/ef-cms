import { TimeFormats } from '@shared/business/utilities/DateHandler';
import { formatDateFromDatePicker } from '@web-client/presenter/actions/formatDateFromDatePicker';
import { sequence } from 'cerebral';
import { setFormValueAction } from '../actions/setFormValueAction';
// import { validateCaseWorksheetSequence } from '@web-client/presenter/sequences/validateCaseWorksheetSequence';

export const formatAndUpdateDateFromDatePickerSequence = sequence<{
  key: string;
  value: string;
  toFormat: TimeFormats;
}>([
  formatDateFromDatePicker,
  setFormValueAction,
  // validateCaseWorksheetSequence,
]);
