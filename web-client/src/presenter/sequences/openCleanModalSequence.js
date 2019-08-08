import { clearModalStateAction } from '../actions/clearModalStateAction';
import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';

export const openCleanModalSequence = [
  clearModalStateAction,
  set(state.showModal, props.value),
];
