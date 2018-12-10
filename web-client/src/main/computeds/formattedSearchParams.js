import { state } from 'cerebral';

export const formattedSearchParams = get => {
  let searchTerm = get(state.searchTerm);
  // noop
  return searchTerm;
};
