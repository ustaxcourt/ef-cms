import { getTodaysOrdersAction } from '../../actions/Public/getTodaysOrdersAction';
import { mapTableSortToTodaysOrdersSortAction } from '../../actions/Public/mapTableSortToTodaysOrdersSortAction';
import { setTableSortConfigurationAction } from '../../actions/setTableSortConfigurationAction';
import { setTodaysOrdersAction } from '../../actions/Public/setTodaysOrdersAction';
import { showProgressSequenceDecorator } from '../../utilities/showProgressSequenceDecorator';

export const sortTodaysOrdersSequence = showProgressSequenceDecorator([
  setTableSortConfigurationAction,
  mapTableSortToTodaysOrdersSortAction,
  getTodaysOrdersAction,
  setTodaysOrdersAction,
]) as unknown as (props: {
  sortField: string;
  sortOrder: 'asc' | 'desc';
  stateKey?: string;
}) => void;
