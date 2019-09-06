import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';
import { submitAdvancedSearchAction } from '../actions/AdvancedSearch/submitAdvancedSearchAction';

export const submitAdvancedSearchSequence = [
  //validate search action
  submitAdvancedSearchAction,
  set(state.searchResults, props.searchResults),
];
