import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setConfirmEditModalStateAction } from '../actions/setConfirmEditModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openConfirmRemoveSignatureModalSequence = [
  clearModalStateAction,
  setConfirmEditModalStateAction,
  setShowModalFactoryAction('ConfirmRemoveSignatureModal'),
];
