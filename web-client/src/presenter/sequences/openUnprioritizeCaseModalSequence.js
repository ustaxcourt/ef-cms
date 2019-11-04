import { clearModalAction } from '../actions/clearModalAction';
import { set } from 'cerebral/factories';
import { state } from 'cerebral';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const openUnprioritizeCaseModalSequence = [
  stopShowValidationAction,
  clearModalAction,
  set(state.showModal, 'UnprioritizeCaseModal'),
];
