import { set } from 'cerebral/factories';
import { state, props } from 'cerebral';

export const updateCaseValueSequence = [
  set(state.caseDetail[props.key], props.value),
];
