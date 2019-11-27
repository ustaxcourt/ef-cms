import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';

export const updateDocketNumberSearchFormSequence = [
  set(state.docketNumberSearchForm[props.key], props.value),
];
