import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';

export const updateCaseValueSequence = [
  set(state.caseDetail[props.key], props.value),
];
