import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';

export const updateSearchTermSequence = [
  set(state.header.searchTerm, props.searchTerm),
];
