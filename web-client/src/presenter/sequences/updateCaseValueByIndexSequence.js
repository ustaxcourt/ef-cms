import { set } from 'cerebral/factories';
import { props, state } from 'cerebral';

export const updateCaseValueByIndexSequence = [
  set(state.caseDetail[props.key][props.index][props.subKey], props.value),
];
