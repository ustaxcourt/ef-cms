// import { clearTodaysOrdersAction } from '../../actions/Public/clearTodaysOrdersAction'; //fixme - ask Kristen
import { getTodaysOrdersAction } from '../../actions/Public/getTodaysOrdersAction';
import { setCurrentPageAction } from '../../actions/setCurrentPageAction';
import { setTodaysOrdersAction } from '../../actions/Public/setTodaysOrdersAction';
import { showProgressSequenceDecorator } from '../../utilities/sequenceHelpers';

export const gotoTodaysOrdersSequence = showProgressSequenceDecorator([
  // clearTodaysOrdersAction,
  getTodaysOrdersAction,
  setTodaysOrdersAction,
  setCurrentPageAction('TodaysOrders'),
]);
