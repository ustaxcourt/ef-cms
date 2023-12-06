import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openConfirmServeToIrsModalSequence = [
  clearModalStateAction,
  setShowModalFactoryAction('ConfirmServeToIrsModal'),
];
