import { clearFormAction } from '../actions/clearFormAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setCaseDeadlineFormAction } from '../actions/CaseDeadline/setCaseDeadlineFormAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setTodaysDateAction } from '../actions/setTodaysDateAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const openEditCaseDeadlineModalSequence = [
  stopShowValidationAction,
  clearModalStateAction,
  clearFormAction,
  setCaseDeadlineFormAction,
  setTodaysDateAction,
  setShowModalFactoryAction('EditCaseDeadlineModalDialog'),
];
