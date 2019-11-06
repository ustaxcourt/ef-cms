import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openRemoveFromTrialSessionModalSequence = [
  clearModalStateAction,
  setShowModalFactoryAction('RemoveFromTrialSessionModal'),
];
