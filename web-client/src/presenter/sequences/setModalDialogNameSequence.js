import { props, state } from 'cerebral';

import { set } from 'cerebral/factories';

export const setModalDialogNameSequence = [
  set(state.showModal, props.showModal),
];
