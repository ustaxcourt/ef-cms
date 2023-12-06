import { setTableSortConfigurationAction } from '../actions/setTableSortConfigurationAction';

export const sortTableSequence = [
  setTableSortConfigurationAction,
] as unknown as (props: {
  sortField: string;
  sortOrder: 'asc' | 'desc';
}) => void;
