import { set } from 'cerebral/factories';
import { state, props } from 'cerebral';

export const updateSearchTermSequence = [
  set(state.searchTerm, props.searchTerm),
];
