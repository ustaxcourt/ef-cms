import { set } from 'cerebral/factories';
import { props, state } from 'cerebral';

export const updateSearchTermSequence = [
  set(state.searchTerm, props.searchTerm),
];
