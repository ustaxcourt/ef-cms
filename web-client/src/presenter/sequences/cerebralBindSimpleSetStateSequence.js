import { set } from 'cerebral/factories';
import { props, state } from 'cerebral';

export const cerebralBindSimpleSetStateSequence = [
  set(state[props.key], props.value),
];
