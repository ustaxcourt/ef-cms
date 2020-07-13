import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setConfirmEditModalStateAction } from '../actions/setConfirmEditModalStateAction';
import { setParentMessageIdAction } from '../actions/setParentMessageIdAction';
import { setRedirectUrlAction } from '../actions/setRedirectUrlAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openConfirmEditModalSequence = [
  clearModalStateAction,
  setConfirmEditModalStateAction,
  setRedirectUrlAction,
  setParentMessageIdAction,
  setShowModalFactoryAction('ConfirmEditModal'),
];
