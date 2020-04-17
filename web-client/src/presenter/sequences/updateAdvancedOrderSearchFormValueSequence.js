import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';

export const updateAdvancedOrderSearchFormValueSequence = [
  set(state.advancedSearchForm['orderSearch'][props.key], props.value),
];
