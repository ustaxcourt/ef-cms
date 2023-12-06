import { fetchPendingItemsAction } from '../../actions/PendingItems/fetchPendingItemsAction';
import { setPendingItemsAction } from '../../actions/PendingItems/setPendingItemsAction';
import { showProgressSequenceDecorator } from '../../utilities/showProgressSequenceDecorator';

export const fetchPendingItemsSequence = showProgressSequenceDecorator([
  fetchPendingItemsAction,
  setPendingItemsAction,
]) as unknown as () => void;
