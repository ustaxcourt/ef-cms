import { clearModalStateAction } from '../actions/clearModalStateAction';
import { set } from 'cerebral/factories';
import { state } from 'cerebral';

export const openCreateMessageModalSequence = [
  clearModalStateAction,
  set(state.showModal, 'CreateMessageModalDialog'),
];
