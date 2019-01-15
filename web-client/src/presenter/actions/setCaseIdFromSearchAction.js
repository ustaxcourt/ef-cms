import { state } from 'cerebral';
const docketNumberMatcher = /^(\d{3,5}-\d{2}).*/;

export default ({ store, get }) => {
  const searchTerm = get(state.searchTerm);
  const match = docketNumberMatcher.exec(searchTerm);
  const docketNumber = match && match.length > 1 ? match[1] : searchTerm;
  store.set(state.caseId, docketNumber);
  return {
    caseId: docketNumber,
  };
};
