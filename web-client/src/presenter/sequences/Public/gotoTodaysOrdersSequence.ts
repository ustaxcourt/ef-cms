import { getTodaysOrdersAction } from '../../actions/Public/getTodaysOrdersAction';
import { setCurrentPageAction } from '../../actions/setCurrentPageAction';
import { setTodaysOrdersAction } from '../../actions/Public/setTodaysOrdersAction';
import { showProgressSequenceDecorator } from '../../utilities/showProgressSequenceDecorator';

export const gotoTodaysOrdersSequence = showProgressSequenceDecorator([
  getTodaysOrdersAction,
  setTodaysOrdersAction,
  setCurrentPageAction('TodaysOrders'),
]);
