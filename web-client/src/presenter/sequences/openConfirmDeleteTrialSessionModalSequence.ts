import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openConfirmDeleteTrialSessionModalSequence = [
  clearModalStateAction,
  setShowModalFactoryAction('DeleteTrialSessionModal'),
];
