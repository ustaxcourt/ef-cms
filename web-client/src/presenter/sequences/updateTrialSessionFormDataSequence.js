import { computeTrialSessionFormDataAction } from '../actions/TrialSession/computeTrialSessionFormDataAction';
import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';

export const updateTrialSessionFormDataSequence = [
  set(state.form[props.key], props.value),
  computeTrialSessionFormDataAction,
];
