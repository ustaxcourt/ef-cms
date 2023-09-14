import { formatDateFromDatePicker } from '@web-client/presenter/actions/formatDateFromDatePicker';
import { setFormValueAction } from '../actions/setFormValueAction';
import { validateCaseWorksheetSequence } from '@web-client/presenter/sequences/validateCaseWorksheetSequence';

export const formatAndUpdateDateFromDatePickerSequence = [
  formatDateFromDatePicker,
  setFormValueAction,
  validateCaseWorksheetSequence,
];
