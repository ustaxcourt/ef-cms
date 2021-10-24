import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openConfirmModalSequence = [
  clearModalStateAction,
  setShowModalFactoryAction('ConfirmModalDialog'),
];
