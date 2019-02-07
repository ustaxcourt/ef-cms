import { set } from 'cerebral/factories';
import { state, props } from 'cerebral';

export default [
  set(state.caseDetail[props.key][props.index][props.subKey], props.value),
];
