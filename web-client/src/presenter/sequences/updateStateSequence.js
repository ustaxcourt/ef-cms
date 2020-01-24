import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';

export const updateStateSequence = [set(state[props.key], props.value)];
