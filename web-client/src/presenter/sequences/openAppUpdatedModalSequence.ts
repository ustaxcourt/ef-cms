import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openAppUpdatedModalSequence = [
  clearModalStateAction,
  setShowModalFactoryAction('AppUpdatedModal'),
];
