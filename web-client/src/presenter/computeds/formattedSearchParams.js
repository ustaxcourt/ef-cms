import _ from 'lodash';
import { state } from 'cerebral';

export const formattedSearchParams = get => {
  let searchTerm = get(state.searchTerm);
  searchTerm = _.padStart(searchTerm, 8, '0');
  return searchTerm;
};
