import {
  ADVANCED_SEARCH_TABS,
  ASCENDING,
  DESCENDING,
} from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

type AdvancedSearchResultsSortStateKey =
  'caseSearchSort' | 'opinionDocumentSearchSort' | 'orderDocumentSearchSort';

export const setAdvancedSearchResultsSortAction = ({
  get,
  props,
  store,
}: ActionProps<{
  sortColumn: string;
  sortDirection: typeof ASCENDING | typeof DESCENDING;
}>) => {
  const { sortColumn, sortDirection } = props;
  const advancedSearchTab = get(state.advancedSearchTab) as string;
  let stateKey: AdvancedSearchResultsSortStateKey;

  if (advancedSearchTab === ADVANCED_SEARCH_TABS.CASE) {
    stateKey = 'caseSearchSort';
  } else if (advancedSearchTab === ADVANCED_SEARCH_TABS.ORDER) {
    stateKey = 'orderDocumentSearchSort';
  } else if (advancedSearchTab === ADVANCED_SEARCH_TABS.OPINION) {
    stateKey = 'opinionDocumentSearchSort';
  } else {
    return;
  }

  store.set(state[stateKey].sortColumn, sortColumn);
  store.set(state[stateKey].sortDirection, sortDirection);
};
