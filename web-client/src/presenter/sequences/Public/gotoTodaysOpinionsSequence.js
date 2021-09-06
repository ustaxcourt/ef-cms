import { getTodaysOpinionsAction } from '../../actions/Public/getTodaysOpinionsAction';
import { setCurrentPageAction } from '../../actions/setCurrentPageAction';
import { setTodaysOpinionsAction } from '../../actions/Public/setTodaysOpinionsAction';
import { showProgressSequenceDecorator } from '../../utilities/showProgressSequenceDecorator';
import { startWebSocketConnectionSequenceDecorator } from '../../utilities/startWebSocketConnectionSequenceDecorator';

// todo ??
export const gotoTodaysOpinionsSequence =
  startWebSocketConnectionSequenceDecorator(
    showProgressSequenceDecorator([
      getTodaysOpinionsAction,
      setTodaysOpinionsAction,
      setCurrentPageAction('TodaysOpinions'),
    ]),
  );
