import { clearModalAction } from '../actions/clearModalAction';
import { set } from 'cerebral/factories';
import { state } from 'cerebral';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const openPrioritizeCaseModalSequence = [
  stopShowValidationAction,
  clearModalAction,
  set(state.showModal, 'PrioritizeCaseModal'),
];
