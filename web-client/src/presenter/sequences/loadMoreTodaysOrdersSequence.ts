import { getTodaysOrdersAction } from '../actions/Public/getTodaysOrdersAction';
import { setTodaysOrdersAction } from '../actions/Public/setTodaysOrdersAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const loadMoreTodaysOrdersSequence = showProgressSequenceDecorator([
  getTodaysOrdersAction,
  setTodaysOrdersAction,
]);
