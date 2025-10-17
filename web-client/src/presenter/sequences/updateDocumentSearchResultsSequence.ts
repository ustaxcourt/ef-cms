import { setDocumentSearchResultsAction } from '../actions/AdvancedSearch/setDocumentSearchResultsAction';

export const updateDocumentSearchResultsSequence = [
  setDocumentSearchResultsAction,
] as unknown as (props: {
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
}) => void;
