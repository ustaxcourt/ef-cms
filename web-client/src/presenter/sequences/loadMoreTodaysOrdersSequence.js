import { getTodaysOrdersAction } from '../actions/Public/getTodaysOrdersAction';
import { setTodaysOrdersAction } from '../actions/Public/setTodaysOrdersAction';

export const loadMoreTodaysOrdersSequence = [
  getTodaysOrdersAction,
  setTodaysOrdersAction,
];
