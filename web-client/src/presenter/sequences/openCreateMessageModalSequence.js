import { set } from 'cerebral/factories';
import { state } from 'cerebral';

export const openCreateMessageModalSequence = [
  set(state.showModal, 'CreateMessageModalDialog'),
];
