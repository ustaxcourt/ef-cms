import { clearFormAction } from '../actions/clearFormAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openCreateCaseDeadlineModalSequence = [
  clearModalStateAction,
  clearFormAction,
  setShowModalFactoryAction('CreateCaseDeadlineModalDialog'),
];
