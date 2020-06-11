import { setCurrentPageAction } from '../../actions/setCurrentPageAction';
import { showProgressSequenceDecorator } from '../../utilities/sequenceHelpers';

export const gotoTodaysOpinionsSequence = showProgressSequenceDecorator([
  // getTodaysOpinions
  // setTodaysOpinions
  setCurrentPageAction('TodaysOpinions'),
]);
