import { getTodaysOrdersAction } from '../../actions/Public/getTodaysOrdersAction';
import { resetTodaysOrdersPageAction } from '../../actions/Public/resetTodaysOrdersPageAction';
import { setSessionMetadataValueAction } from '../../actions/setSessionMetadataValueAction';
import { setTodaysOrdersAction } from '../../actions/Public/setTodaysOrdersAction';
import { showProgressSequenceDecorator } from '../../utilities/sequenceHelpers';

export const sortTodaysOrdersSequence = showProgressSequenceDecorator([
  setSessionMetadataValueAction,
  resetTodaysOrdersPageAction,
  getTodaysOrdersAction,
  setTodaysOrdersAction,
]);
