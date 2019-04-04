import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';

export const updateCaseValueByIndexSequence = [
  set(state.caseDetail[props.key][props.index][props.subKey], props.value),
];
