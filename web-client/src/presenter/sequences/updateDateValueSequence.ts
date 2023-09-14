import { formatDateAction } from '@web-client/presenter/actions/formatDateAction';
import { setFormValueAction } from '../actions/setFormValueAction';
import { validateCaseWorksheetSequence } from '@web-client/presenter/sequences/validateCaseWorksheetSequence';

export const updateDateValueSequence = [
  formatDateAction,
  setFormValueAction,
  validateCaseWorksheetSequence,
];
