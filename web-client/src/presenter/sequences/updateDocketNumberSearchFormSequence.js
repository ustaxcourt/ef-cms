import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';

export const updateDocketNumberSearchFormSequence = [
  set(state.advancedSearchForm.docketNumberSearch[props.key], props.value),
];
