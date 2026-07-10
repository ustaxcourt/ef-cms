import {
  ASCENDING,
  DESCENDING,
} from '@shared/business/entities/EntityConstants';
import { setAdvancedSearchResultsSortAction } from '../actions/AdvancedSearch/setAdvancedSearchResultsSortAction';

export const updateAdvancedSearchResultsSortSequence = [
  setAdvancedSearchResultsSortAction,
] as unknown as (props: {
  sortColumn: string;
  sortDirection: typeof ASCENDING | typeof DESCENDING;
}) => void;
