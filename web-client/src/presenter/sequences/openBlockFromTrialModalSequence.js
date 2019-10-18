import { set } from 'cerebral/factories';
import { state } from 'cerebral';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const openBlockFromTrialModalSequence = [
  stopShowValidationAction,
  set(state.showModal, 'BlockFromTrialModal'),
];
