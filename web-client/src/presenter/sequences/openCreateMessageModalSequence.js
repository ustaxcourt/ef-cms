import { clearModalStateAction } from '../actions/clearModalStateAction';
import { set } from 'cerebral/factories';
import { setCreateMessageModalDialogModalStateAction } from '../actions/WorkItem/setCreateMessageModalDialogModalStateAction';
import { state } from 'cerebral';

export const openCreateMessageModalSequence = [
  clearModalStateAction,
  setCreateMessageModalDialogModalStateAction,
  set(state.showModal, 'CreateMessageModalDialog'),
];
