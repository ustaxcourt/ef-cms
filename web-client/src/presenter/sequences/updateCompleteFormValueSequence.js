import { set } from 'cerebral/factories';
import { state, props } from 'cerebral';

export default [
  set(state.completeForm[props.workItemId][props.key], props.value),
];
