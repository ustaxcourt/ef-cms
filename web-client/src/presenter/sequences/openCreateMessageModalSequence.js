import { set } from 'cerebral/factories';
import { state } from 'cerebral';
import { clearModalStateAction } from '../actions/clearModalStateAction';

export const openCreateMessageModalSequence = [
  clearModalStateAction,
  set(state.showModal, 'CreateMessageModalDialog'),
];
