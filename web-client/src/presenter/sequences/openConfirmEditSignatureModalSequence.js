import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setConfirmEditModalStateAction } from '../actions/setConfirmEditModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openConfirmEditSignatureModalSequence = [
  clearModalStateAction,
  setConfirmEditModalStateAction,
  setShowModalFactoryAction('ConfirmEditSignatureModal'),
];
