import { set } from 'cerebral/factories';
import { props, state } from 'cerebral';

export const setModalDialogNameSequence = [
  set(state.showModal, props.showModal),
];
