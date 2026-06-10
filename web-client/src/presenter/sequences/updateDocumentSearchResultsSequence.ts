import {
  ASCENDING,
  DESCENDING,
} from '@shared/business/entities/EntityConstants';
import { setDocumentSearchResultsAction } from '../actions/AdvancedSearch/setDocumentSearchResultsAction';

export const updateDocumentSearchResultsSequence = [
  setDocumentSearchResultsAction,
] as unknown as (props: {
  sortColumn: string;
  sortDirection: typeof ASCENDING | typeof DESCENDING;
}) => void;
