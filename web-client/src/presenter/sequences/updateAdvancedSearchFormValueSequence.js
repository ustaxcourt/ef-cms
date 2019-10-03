import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';

export const updateAdvancedSearchFormValueSequence = [
  set(state.advancedSearchForm[props.key], props.value),
];
