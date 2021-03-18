import { getTodaysOrdersAction } from '../../actions/Public/getTodaysOrdersAction';
import { setSessionMetadataValueAction } from '../../actions/setSessionMetadataValueAction';
import { setTodaysOrdersAction } from '../../actions/Public/setTodaysOrdersAction';
import { showProgressSequenceDecorator } from '../../utilities/sequenceHelpers';

export const sortTodaysOrdersSequence = showProgressSequenceDecorator([
  setSessionMetadataValueAction,
  // FIXME: set today's orders page to 1 when we change the sort
  getTodaysOrdersAction,
  setTodaysOrdersAction,
]);
