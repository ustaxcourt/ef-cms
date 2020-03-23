import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setConfirmEditModalStateAction } from '../actions/setConfirmEditModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openConfirmEditModalSequence = [
  clearModalStateAction,
  setConfirmEditModalStateAction,
  setShowModalFactoryAction('ConfirmEditModal'),
];
