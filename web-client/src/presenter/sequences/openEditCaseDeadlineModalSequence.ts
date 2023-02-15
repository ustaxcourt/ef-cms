import { clearFormAction } from '../actions/clearFormAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setCaseDeadlineFormAction } from '../actions/CaseDeadline/setCaseDeadlineFormAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const openEditCaseDeadlineModalSequence = [
  stopShowValidationAction,
  clearModalStateAction,
  clearFormAction,
  setCaseDeadlineFormAction,
  setShowModalFactoryAction('EditCaseDeadlineModalDialog'),
];
