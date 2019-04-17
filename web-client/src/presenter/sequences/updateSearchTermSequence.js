import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';

export const updateSearchTermSequence = [
  set(state.searchTerm, props.searchTerm),
];
