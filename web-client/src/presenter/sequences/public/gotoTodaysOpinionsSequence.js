import { getTodaysOpinionsAction } from '../../actions/Public/getTodaysOpinionsAction';
import { setCurrentPageAction } from '../../actions/setCurrentPageAction';
import { setTodaysOpinionsAction } from '../../actions/Public/setTodaysOpinionsAction';
import { showProgressSequenceDecorator } from '../../utilities/sequenceHelpers';

export const gotoTodaysOpinionsSequence = showProgressSequenceDecorator([
  getTodaysOpinionsAction,
  setTodaysOpinionsAction,
  setCurrentPageAction('TodaysOpinions'),
]);
