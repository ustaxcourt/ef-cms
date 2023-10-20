import { sequence } from 'cerebral';
import { setTableSortConfigurationAction } from '../actions/setTableSortConfigurationAction';

export const sortTableSequence = sequence<{
  sortField: string;
  sortOrder: 'asc' | 'desc';
}>([setTableSortConfigurationAction]);
