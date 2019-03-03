import { set } from 'cerebral/factories';
import { props, state } from 'cerebral';

export const updateCaseValueSequence = [
  set(state.caseDetail[props.key], props.value),
];
