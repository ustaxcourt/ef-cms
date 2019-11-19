import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openConfirmInitiateServiceModalSequence = [
  clearModalStateAction,
  setShowModalFactoryAction('ConfirmInitiateServiceModal'),
];
