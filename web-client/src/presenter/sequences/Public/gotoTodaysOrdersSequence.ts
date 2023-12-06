import { getTodaysOrdersAction } from '../../actions/Public/getTodaysOrdersAction';
import { setTodaysOrdersAction } from '../../actions/Public/setTodaysOrdersAction';
import { setupCurrentPageAction } from '../../actions/setupCurrentPageAction';
import { showProgressSequenceDecorator } from '../../utilities/showProgressSequenceDecorator';

export const gotoTodaysOrdersSequence = showProgressSequenceDecorator([
  getTodaysOrdersAction,
  setTodaysOrdersAction,
  setupCurrentPageAction('TodaysOrders'),
]);
