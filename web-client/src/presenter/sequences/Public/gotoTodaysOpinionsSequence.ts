import { getTodaysOpinionsAction } from '../../actions/Public/getTodaysOpinionsAction';
import { setTodaysOpinionsAction } from '../../actions/Public/setTodaysOpinionsAction';
import { setupCurrentPageAction } from '../../actions/setupCurrentPageAction';
import { showProgressSequenceDecorator } from '../../utilities/showProgressSequenceDecorator';

export const gotoTodaysOpinionsSequence = showProgressSequenceDecorator([
  getTodaysOpinionsAction,
  setTodaysOpinionsAction,
  setupCurrentPageAction('TodaysOpinions'),
]);
