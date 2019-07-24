import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';

export const cerebralBindSimpleSetStateSequence = [
  set(state[props.key], props.value),
];
