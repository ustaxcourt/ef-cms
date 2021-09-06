import { getTodaysOrdersAction } from '../../actions/Public/getTodaysOrdersAction';
import { setCurrentPageAction } from '../../actions/setCurrentPageAction';
import { setTodaysOrdersAction } from '../../actions/Public/setTodaysOrdersAction';
import { showProgressSequenceDecorator } from '../../utilities/showProgressSequenceDecorator';
import { startWebSocketConnectionSequenceDecorator } from '../../utilities/startWebSocketConnectionSequenceDecorator';

//todo ??
export const gotoTodaysOrdersSequence =
  startWebSocketConnectionSequenceDecorator(
    showProgressSequenceDecorator([
      getTodaysOrdersAction,
      setTodaysOrdersAction,
      setCurrentPageAction('TodaysOrders'),
    ]),
  );
