import { clearFormAction } from '../actions/clearFormAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setCaseDeadlineFormAction } from '../actions/CaseDeadline/setCaseDeadlineFormAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openEditCaseDeadlineModalSequence = [
  clearModalStateAction,
  clearFormAction,
  setCaseDeadlineFormAction,
  setShowModalFactoryAction('EditCaseDeadlineModalDialog'),
];
