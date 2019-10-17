import { clearModalStateAction } from '../actions/clearModalStateAction';
import { set } from 'cerebral/factories';
import { state } from 'cerebral';

export const openRemoveFromTrialSessionModalSequence = [
  clearModalStateAction,
  set(state.showModal, 'RemoveFromTrialSessionModal'),
];
