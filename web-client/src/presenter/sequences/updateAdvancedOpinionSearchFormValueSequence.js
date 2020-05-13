import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';

export const updateAdvancedOpinionSearchFormValueSequence = [
  set(state.advancedSearchForm['opinionSearch'][props.key], props.value),
];
